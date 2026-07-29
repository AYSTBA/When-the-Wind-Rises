import { db } from "@/db/client"
import { getCurrentUser } from "@/lib/auth"

const VALID_MOODS = ["很开心", "开心", "一般", "低落", "很失落"] as const
type ValidMood = (typeof VALID_MOODS)[number]

export async function getTodayMoodRecord(userId: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return db.moodRecord.findFirst({
    where: {
      userId,
      createdAt: { gte: today },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function recordMood(mood: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("请先登录")

  if (!VALID_MOODS.includes(mood as ValidMood)) {
    throw new Error("无效的心情值")
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await db.moodRecord.findFirst({
    where: {
      userId: user.id,
      createdAt: { gte: today },
    },
  })

  if (existing) {
    throw new Error("今天已经记录过心情了")
  }

  return db.moodRecord.create({
    data: {
      userId: user.id,
      mood: mood as ValidMood,
    },
  })
}

export { VALID_MOODS }
