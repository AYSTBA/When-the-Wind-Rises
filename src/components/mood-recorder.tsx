"use client"

import { useState } from "react"
import { toast } from "sonner"

const MOOD_OPTIONS = [
  { value: "很开心", emoji: "😄", label: "很开心" },
  { value: "开心", emoji: "😊", label: "开心" },
  { value: "一般", emoji: "😐", label: "一般" },
  { value: "低落", emoji: "😔", label: "低落" },
  { value: "很失落", emoji: "😞", label: "很失落" },
]

interface MoodRecorderProps {
  initialTodayMood?: string | null
}

export function MoodRecorder({ initialTodayMood }: MoodRecorderProps) {
  const [todayMood, setTodayMood] = useState(initialTodayMood)
  const [loading, setLoading] = useState(false)

  async function handleRecord(mood: string) {
    if (todayMood) return
    setLoading(true)
    try {
      const res = await fetch("/api/mood-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message ?? "记录心情失败")
        return
      }
      setTodayMood(mood)
      toast.success("心情已记录")
    } catch {
      toast.error("网络错误，请稍后再试")
    } finally {
      setLoading(false)
    }
  }

  if (todayMood) {
    const recorded = MOOD_OPTIONS.find((m) => m.value === todayMood)
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
        <span className="text-2xl">{recorded?.emoji ?? "📝"}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">今日心情：{todayMood}</p>
          <p className="text-xs text-muted-foreground">今天的心情已经记录啦~</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">现在心情怎么样</p>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.value}
            type="button"
            disabled={loading}
            onClick={() => handleRecord(mood.value)}
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background transition-all hover:border-foreground/30 hover:bg-accent active:scale-95 disabled:opacity-50"
            title={mood.label}
          >
            <span className="text-2xl">{mood.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
