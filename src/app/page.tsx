import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { getSiteSettings } from "@/lib/site-settings"
import { getMoodSummary } from "@/lib/mood-summary"
import { getTodayMoodRecord } from "@/lib/mood-record-service"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { MoodRecorder } from "@/components/mood-recorder"
import { MoodPieChart } from "@/components/mood-pie-chart"

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

export default async function MoodPage() {
  const [settings, user] = await Promise.all([
    getSiteSettings(),
    getCurrentUser(),
  ])

  const moodSummary = await getMoodSummary(user?.id)

  const todayMood = user ? await getTodayMoodRecord(user.id) : null

  const dayCount = moodSummary.daySummaries.length
  const hasAnyData = dayCount > 0

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-[1200px] px-4 py-6">
        <div className="flex items-stretch justify-center gap-3 sm:gap-4">
          {/* 最近心情 - 正方形小卡片 */}
          <Card className="h-[160px] w-[120px] shrink-0 sm:w-[160px]">
            <CardContent className="flex h-full flex-col items-center justify-center gap-1 p-0">
              {hasAnyData ? (
                <>
                  <span className="text-5xl font-light tabular-nums leading-none">
                    {moodSummary.averageScore.toFixed(1)}
                  </span>
                  <span className="mt-2 text-sm text-muted-foreground">最近心情</span>
                  <span className="text-xs text-muted-foreground/70">{moodSummary.totalPostCount}笺 · {moodSummary.totalMoodCount}心情</span>
                </>
              ) : (
                <>
                  <span className="text-4xl">🌙</span>
                  <span className="mt-2 text-sm text-muted-foreground">最近心情</span>
                </>
              )}
            </CardContent>
          </Card>

          {/* 今日心情记录 - 与最近心情同一行同一高度 */}
          <Card className="h-[160px] min-w-0 flex-1 sm:w-auto sm:min-w-[280px] sm:flex-none">
            <CardContent className="flex h-full w-full flex-col items-center justify-center px-2 sm:px-4">
              {user ? (
                <MoodRecorder initialTodayMood={todayMood?.mood ?? null} />
              ) : (
                <p className="text-sm text-muted-foreground">登录后即可记录心情</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 心情分布饼图 */}
        {hasAnyData && (
          <div className="mt-6 max-w-md mx-auto">
            <MoodPieChart distribution={moodSummary.moodDistribution} />
          </div>
        )}
      </div>
    </div>
  )
}
