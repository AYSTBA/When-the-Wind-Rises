import { db } from "@/db/client"

export const MOOD_MAP: Record<string, { score: number; emoji: string }> = {
  "很开心": { score: 5, emoji: "😄" },
  "开心": { score: 4, emoji: "😊" },
  "一般": { score: 3, emoji: "😐" },
  "低落": { score: 2, emoji: "😔" },
  "很失落": { score: 1, emoji: "😞" },
}

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function getMoodEmoji(mood: string): string {
  return MOOD_MAP[mood]?.emoji ?? "📝"
}

export function getMoodScore(mood: string): number {
  return MOOD_MAP[mood]?.score ?? 0
}

export interface DayMoodSummary {
  date: string
  mood: string
  emoji: string
  postCount: number
  moodCount: number
  averageScore: number
}

export interface MoodSummaryData {
  daySummaries: DayMoodSummary[]
  averageScore: number
  dominantMood: string
  dominantEmoji: string
  totalPostCount: number
  totalMoodCount: number
  moodDistribution: Record<string, number>
}

export async function getMoodSummary(userId?: number): Promise<MoodSummaryData> {
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  if (!userId) {
    return {
      daySummaries: [],
      averageScore: 0,
      dominantMood: "",
      dominantEmoji: "🌙",
      totalPostCount: 0,
      totalMoodCount: 0,
      moodDistribution: {},
    }
  }

  const posts = await db.post.findMany({
    where: {
      authorId: userId,
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      mood: true,
      createdAt: true,
    },
  })

  const moodRecords = await db.moodRecord.findMany({
    where: {
      userId,
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      mood: true,
      createdAt: true,
    },
  })

  const allEntries = [
    ...posts.map((p) => ({ mood: p.mood, createdAt: p.createdAt })),
    ...moodRecords.map((r) => ({ mood: r.mood, createdAt: r.createdAt })),
  ]

  if (allEntries.length === 0) {
    return {
      daySummaries: [],
      averageScore: 0,
      dominantMood: "",
      dominantEmoji: "🌙",
      totalPostCount: 0,
      totalMoodCount: 0,
      moodDistribution: {},
    }
  }

  const byDay = new Map<string, { moodTotal: number; moodCount: number; postCount: number; moodCounts: Map<string, number> }>()

  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    const key = toLocalDateKey(d)
    byDay.set(key, { moodTotal: 0, moodCount: 0, postCount: 0, moodCounts: new Map() })
  }

  for (const entry of allEntries) {
    const key = toLocalDateKey(entry.createdAt)
    const dayEntry = byDay.get(key)
    if (!dayEntry) continue
    dayEntry.postCount += 1
    if (entry.mood) {
      const sc = getMoodScore(entry.mood)
      dayEntry.moodTotal += sc
      dayEntry.moodCount += 1
      dayEntry.moodCounts.set(entry.mood, (dayEntry.moodCounts.get(entry.mood) ?? 0) + 1)
    }
  }

  const daySummaries: DayMoodSummary[] = []
  let grandMoodTotal = 0
  let grandMoodCount = 0
  let grandPostCount = 0
  const allMoodCounts = new Map<string, number>()

  for (const [date, entry] of byDay) {
    if (entry.postCount === 0) continue

    const avg = entry.moodCount > 0 ? entry.moodTotal / entry.moodCount : 0
    let dominantMood = ""
    let maxCount = 0
    for (const [mood, c] of entry.moodCounts) {
      if (c > maxCount) {
        maxCount = c
        dominantMood = mood
      }
      allMoodCounts.set(mood, (allMoodCounts.get(mood) ?? 0) + c)
    }

    grandMoodTotal += entry.moodTotal
    grandMoodCount += entry.moodCount
    grandPostCount += entry.postCount

    daySummaries.push({
      date,
      mood: dominantMood,
      emoji: dominantMood ? getMoodEmoji(dominantMood) : "📝",
      postCount: entry.postCount,
      moodCount: entry.moodCount,
      averageScore: avg,
    })
  }

  const averageScore = grandMoodCount > 0 ? grandMoodTotal / grandMoodCount : 0
  let dominantMood = ""
  let maxCount = 0
  for (const [mood, c] of allMoodCounts) {
    if (c > maxCount) {
      maxCount = c
      dominantMood = mood
    }
  }

  return {
    daySummaries,
    averageScore,
    dominantMood: dominantMood || scoreToMood(averageScore),
    dominantEmoji: dominantMood ? getMoodEmoji(dominantMood) : "🌙",
    totalPostCount: grandPostCount,
    totalMoodCount: grandMoodCount,
    moodDistribution: Object.fromEntries(allMoodCounts),
  }
}

function scoreToMood(score: number): string {
  if (score === 0) return ""
  const entries = Object.entries(MOOD_MAP)
  let closest = entries[0][0]
  let closestDiff = Math.abs(score - entries[0][1].score)
  for (const [label, { score: s }] of entries) {
    const diff = Math.abs(score - s)
    if (diff < closestDiff) {
      closest = label
      closestDiff = diff
    }
  }
  return closest
}
