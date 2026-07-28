import type { Metadata } from "next"

import { ForumPageShell } from "@/components/forum/forum-page-shell"
import {
  buildHomeSidebarCurrentUserSettings,
  HomeSidebarPanels,
} from "@/components/home/home-sidebar-panels"
import { SiteHeader } from "@/components/site-header"
import { getZones } from "@/lib/zones"
import { getBoards } from "@/lib/boards"
import { getSiteSettings } from "@/lib/site-settings"
import { getMoodSummary, getMoodEmoji } from "@/lib/mood-summary"
import { getHomeSidebarHotTopics } from "@/lib/home-sidebar"
import { getHomeAnnouncements } from "@/lib/announcements"
import { groupHomeSidebarPanels } from "@/lib/home-sidebar-layout"
import { getHomeSidebarStats } from "@/lib/home-sidebar-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

function MoodDayBlock({ day }: { day: { date: string; mood: string; emoji: string; count: number } }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-background/50 px-3 py-3 min-w-[52px]">
      <span className="text-[11px] text-muted-foreground">{formatDayLabel(day.date)}</span>
      <span className="text-xl leading-none">{day.emoji}</span>
      {day.mood ? (
        <span className="text-[10px] text-muted-foreground leading-tight">{day.mood}</span>
      ) : (
        <span className="text-[10px] text-muted-foreground/50 leading-tight">暂无</span>
      )}
      {day.count > 0 && (
        <span className="text-[10px] text-muted-foreground/70">{day.count}笺</span>
      )}
    </div>
  )
}

function MoodScoreGauge({ score }: { score: number }) {
  const pct = score > 0 ? (score / 5) * 100 : 0
  const color = score >= 4 ? "bg-emerald-500" : score >= 3 ? "bg-amber-500" : score > 0 ? "bg-orange-400" : "bg-muted"
  return (
    <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default async function MoodPage() {
  const [settings, moodSummary, zones, boards, hotTopics, announcements, sidebarStats] = await Promise.all([
    getSiteSettings(),
    getMoodSummary(),
    getZones(),
    getBoards(),
    getHomeSidebarHotTopics(),
    getHomeAnnouncements(),
    getHomeSidebarStats(),
  ])

  const sidebarPanels = groupHomeSidebarPanels([])

  const mainContent = (
    <div className="space-y-6 py-1">
      {/* 心情总结卡片 */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-xl">{moodSummary.dominantEmoji}</span>
            <span>最近心情</span>
            {moodSummary.totalCount > 0 && (
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                近7天 · {moodSummary.totalCount}笺心情
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {moodSummary.totalCount === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="text-4xl">🌙</span>
              <p className="text-sm text-muted-foreground">暂无心情数据</p>
              <p className="text-xs text-muted-foreground/70">发笺时记录心情，七天心情将在这里汇聚</p>
            </div>
          ) : (
            <>
              {/* 平均心情 */}
              <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-4 py-3">
                <span className="text-3xl">{moodSummary.dominantEmoji}</span>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{moodSummary.dominantMood}</p>
                  <p className="text-xs text-muted-foreground">七日平均心情</p>
                  <MoodScoreGauge score={moodSummary.averageScore} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light tabular-nums">{moodSummary.averageScore.toFixed(1)}</p>
                  <p className="text-[10px] text-muted-foreground">/ 5</p>
                </div>
              </div>

              {/* 每日心情 */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">每日心情</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {moodSummary.daySummaries.map((day) => (
                    <MoodDayBlock key={day.date} day={day} />
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 未来心情记录入口占位 */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
          <span className="text-2xl">📝</span>
          <p className="text-sm text-muted-foreground">心情记录</p>
          <p className="text-xs text-muted-foreground/70">即将开放，敬请期待</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-[1200px] px-1">
        <ForumPageShell
          zones={zones}
          boards={boards}
          main={<div className="pb-12">{mainContent}</div>}
          rightSidebar={
            <div className="mt-6 hidden pb-12 lg:block">
              <HomeSidebarPanels
                user={null}
                hotTopics={hotTopics}
                postLinkDisplayMode={settings.postLinkDisplayMode}
                announcements={announcements}
                showAnnouncements={settings.homeSidebarAnnouncementsEnabled}
                friendLinksEnabled={settings.friendLinksEnabled}
                topPanels={sidebarPanels.top}
                middlePanels={sidebarPanels.middle}
                bottomPanels={sidebarPanels.bottom}
                stats={sidebarStats}
                siteName={settings.siteName}
                siteDescription={settings.siteDescription}
                siteLogoPath={settings.siteLogoPath}
                siteIconPath={settings.siteIconPath}
                currentUserSettings={buildHomeSidebarCurrentUserSettings(settings)}
              />
            </div>
          }
        />
      </div>
    </div>
  )
}
