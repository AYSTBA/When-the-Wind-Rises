import Link from "next/link"
import type { ComponentProps } from "react"

import { HomeAnnouncementPanel } from "@/components/home/home-announcement-panel"
import { HomeSidebarCurrentUserCard } from "@/components/home/home-sidebar-current-user-card"
import { HomeSiteStatsCard } from "@/components/home/home-site-stats-card"
import { SidebarUserCard, type SidebarUserCardData } from "@/components/user/sidebar-user-card"

import type { AnnouncementItem } from "@/lib/announcements"
import { groupHomeSidebarPanels, type HomeSidebarPanelItem } from "@/lib/home-sidebar-layout"
import type { HomeSidebarStatsData } from "@/lib/home-sidebar-stats"
import type { SiteSettingsData } from "@/lib/site-settings.types"
import { cn } from "@/lib/utils"
import { AddonSlotRenderer } from "@/addons-host"

interface HotTopicItem {
  id: string
  slug: string
  title: string
  lastReplyAuthorName: string | null
  lastRepliedAt: string
  authorName: string
  authorAvatarPath?: string | null
}

interface HomeSidebarPanelsProps {
  user: SidebarUserCardData | null
  hotTopics?: HotTopicItem[]
  postLinkDisplayMode?: "SLUG" | "ID"
  announcements?: AnnouncementItem[]
  showAnnouncements?: boolean
  createPostHref?: string
  topPanels?: HomeSidebarPanelItem[]
  middlePanels?: HomeSidebarPanelItem[]
  bottomPanels?: HomeSidebarPanelItem[]
  stats?: HomeSidebarStatsData | null
  siteName?: string
  siteDescription?: string
  siteLogoPath?: string | null
  siteIconPath?: string | null
  currentUserSettings?: ComponentProps<typeof HomeSidebarCurrentUserCard>["settings"]
  stickyTopClass?: string
  sticky?: boolean

}

export function buildHomeSidebarCurrentUserSettings(settings: SiteSettingsData): HomeSidebarPanelsProps["currentUserSettings"] {
  return {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    siteLogoPath: settings.siteLogoPath,
    siteIconPath: settings.siteIconPath,
    pointName: settings.pointName,
    checkInEnabled: settings.checkInEnabled,
    checkInReward: settings.checkInReward,
    checkInRewardText: settings.checkInRewardText,
    checkInVip1Reward: settings.checkInVip1Reward,
    checkInVip1RewardText: settings.checkInVip1RewardText,
    checkInVip2Reward: settings.checkInVip2Reward,
    checkInVip2RewardText: settings.checkInVip2RewardText,
    checkInVip3Reward: settings.checkInVip3Reward,
    checkInVip3RewardText: settings.checkInVip3RewardText,
    checkInMakeUpEnabled: settings.checkInMakeUpEnabled,
    checkInMakeUpCardPrice: settings.checkInMakeUpCardPrice,
    checkInVipMakeUpCardPrice: settings.checkInVipMakeUpCardPrice,
    checkInVip1MakeUpCardPrice: settings.checkInVip1MakeUpCardPrice,
    checkInVip2MakeUpCardPrice: settings.checkInVip2MakeUpCardPrice,
    checkInVip3MakeUpCardPrice: settings.checkInVip3MakeUpCardPrice,
    checkInMakeUpCountsTowardStreak: settings.checkInMakeUpCountsTowardStreak,
    checkInMakeUpOldestDayLimit: settings.checkInMakeUpOldestDayLimit,
  }
}

export async function HomeSidebarPanels({ user, hotTopics: _hotTopics, postLinkDisplayMode = "SLUG", announcements = [], showAnnouncements = true, createPostHref, topPanels = [], middlePanels = [], bottomPanels = [], stats = null, siteName, siteDescription, siteLogoPath, siteIconPath, currentUserSettings, stickyTopClass = "top-20", sticky = true }: HomeSidebarPanelsProps) {
  const sidebarPanels = groupHomeSidebarPanels([
    ...topPanels,
    ...middlePanels,
    ...bottomPanels,
  ])

  return (
    <div className={cn("home-sidebar-panels mobile-sidebar-stack flex min-w-0 w-full max-w-full flex-col gap-4", sticky && "sticky", sticky && stickyTopClass)}>
      {currentUserSettings ? (
        <HomeSidebarCurrentUserCard createPostHref={createPostHref} settings={currentUserSettings} />
      ) : (
        <SidebarUserCard user={user} createPostHref={createPostHref} siteName={siteName} siteDescription={siteDescription} siteLogoPath={siteLogoPath} siteIconPath={siteIconPath} />
      )}


      <AddonSlotRenderer slot="home.right.top" />
      {sidebarPanels.top.map((panel) => <div key={panel.id}>{panel.content}</div>)}

      {showAnnouncements ? <HomeAnnouncementPanel announcements={announcements} /> : null}

      <AddonSlotRenderer slot="home.right.middle" />
      {sidebarPanels.middle.map((panel) => <div key={panel.id}>{panel.content}</div>)}

      <AddonSlotRenderer slot="home.right.bottom" />
      {sidebarPanels.bottom.map((panel) => <div key={panel.id}>{panel.content}</div>)}

      {stats ? <HomeSiteStatsCard stats={stats} /> : null}
    </div>
  )
}
