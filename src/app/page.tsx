import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { getZones } from "@/lib/zones"
import { getBoards } from "@/lib/boards"
import { getSiteSettings } from "@/lib/site-settings"
import { getMoodSummary } from "@/lib/mood-summary"
import { Card, CardContent } from "@/components/ui/card"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: `${settings.siteName} · 心情`,
    description: settings.siteDescription,
    openGraph: {
      title: `${settings.siteName} · 心情`,
      description: settings.siteDescription,
      type: "website",
    },
  }
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return "今天"
  if (diff === -1) return "昨天"
  if (diff === -2) return "前天"
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default async function MoodPage() {
  const [settings, moodSummary] = await Promise.all([
    getSiteSettings(),
    getMoodSummary(),
  ])

  const hasData = moodSummary.totalCount > 0
  const dayCount = moodSummary.daySummaries.length

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-[1200px] px-4 py-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {/* 最近心情 - 正方形小卡片 */}
          <Card className="w-[160px] h-[160px] flex flex-col items-center justify-center gap-1">
            <CardContent className="flex flex-col items-center justify-center p-0">
              {hasData ? (
                <>
                  <span className="text-5xl font-light tabular-nums leading-none">
                    {moodSummary.averageScore.toFixed(1)}
                  </span>
                  <span className="mt-2 text-sm text-muted-foreground">最近心情</span>
                  <span className="text-xs text-muted-foreground/70">{dayCount}天数据</span>
                </>
              ) : (
                <>
                  <span className="text-4xl">🌙</span>
                  <span className="mt-2 text-sm text-muted-foreground">最近心情</span>
                </>
              )}
            </CardContent>
          </Card>

          {/* 未来心情记录入口占位 */}
          <Card className="w-[160px] h-[160px] flex flex-col items-center justify-center gap-1 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-0 gap-1">
              <span className="text-3xl">📝</span>
              <span className="text-sm text-muted-foreground">心情记录</span>
              <span className="text-xs text-muted-foreground/70">即将开放</span>
            </CardContent>
          </Card>
        </div>

        {/* 每日心情条 - 仅展示有数据的天 */}
        {hasData && dayCount > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {moodSummary.daySummaries.map((day) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background/50 px-3 py-3 min-w-[52px]"
                >
                  <span className="text-[11px] text-muted-foreground">{formatDayLabel(day.date)}</span>
                  <span className="text-xl leading-none">{day.emoji}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{day.mood}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
