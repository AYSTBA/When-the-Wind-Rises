import { db } from "@/db/client"

export const MOOD_MAP: Record<string, { score: number; emoji: string }> = {
  "很开心": { score: 5, emoji: "😄" },
  "开心": { score: 4, emoji: "😊" },
  "一般": { score: 3, emoji: "😐" },
  "低落": { score: 2, emoji: "😔" },
  "很失落": { score: 1, emoji: "😞" },
}

export function getMoodEmoji(mood: string): string {
  return MOOD_MAP[mood]?.emoji ?? "❓"
}

export function getMoodScore(mood: string): number {
  return MOOD_MAP[mood]?.score ?? 0
}

function scoreToMood(score: number): string {
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

export interface DayMoodSummary {
  date: string
  mood: string
  emoji: string
  count: number
}

export interface MoodSummaryData {
  daySummaries: DayMoodSummary[]
  averageScore: number
  dominantMood: string
  dominantEmoji: string
  totalCount: number
}

const EMPTY_SUMMARY: MoodSummaryData = {
  daySummaries: [],
  averageScore: 0,
  dominantMood: "",
  dominantEmoji: "🌙",
  totalCount: 0,
}

export async function getMoodSummary(): Promise<MoodSummaryData> {
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const posts = await db.post.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      mood: { not: null },
    },
    select: {
      mood: true,
      createdAt: true,
    },
  })

  if (posts.length === 0) return EMPTY_SUMMARY

  const byDay = new Map<string, { total: number; count: number; moodCounts: Map<string, number> }>()

  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    byDay.set(key, { total: 0, count: 0, moodCounts: new Map() })
  }

  for (const post of posts) {
    if (!post.mood) continue
    const key = post.createdAt.toISOString().slice(0, 10)
    const entry = byDay.get(key)
    if (!entry) continue
    const sc = getMoodScore(post.mood)
    entry.total += sc
    entry.count += 1
    entry.moodCounts.set(post.mood, (entry.moodCounts.get(post.mood) ?? 0) + 1)
  }

  const daySummaries: DayMoodSummary[] = []
  let grandTotal = 0
  let grandCount = 0
  const allMoodCounts = new Map<string, number>()

  for (const [date, entry] of byDay) {
    if (entry.count === 0) {
      daySummaries.push({ date, mood: "", emoji: "·", count: 0 })
      continue
    }
    const avg = entry.total / entry.count
    let dominantMood = ""
    let maxCount = 0
    for (const [mood, c] of entry.moodCounts) {
      if (c > maxCount) {
        maxCount = c
        dominantMood = mood
      }
      allMoodCounts.set(mood, (allMoodCounts.get(mood) ?? 0) + c)
    }
    grandTotal += entry.total
    grandCount += entry.count
    daySummaries.push({
      date,
      mood: dominantMood,
      emoji: getMoodEmoji(dominantMood),
      count: entry.count,
    })
  }

  const averageScore = grandCount > 0 ? grandTotal / grandCount : 0
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
    totalCount: grandCount,
  }
}
