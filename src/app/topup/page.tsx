import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { SiteHeader } from "@/components/site-header"
import { RedeemCodeCard } from "@/components/redeem-code-card"
import { getCurrentUser } from "@/lib/auth"
import { getSiteSettings } from "@/lib/site-settings"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title: `兑换 - ${settings.siteName}`,
    description: `使用兑换码领取 ${settings.pointName}。`,
  }
}

export default async function TopupPage() {
  const [currentUser, settings] = await Promise.all([
    getCurrentUser(),
    getSiteSettings(),
  ])

  if (!currentUser) {
    redirect("/login?redirect=/topup")
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-1 py-8">
        <div className="space-y-6">
          <RedeemCodeCard
            pointName={settings.pointName}
            currentPoints={currentUser.points}
            helpLinkEnabled={settings.redeemCodeHelpEnabled}
            helpLinkTitle={settings.redeemCodeHelpTitle}
            helpLinkUrl={settings.redeemCodeHelpUrl}
          />
        </div>
      </main>
    </div>
  )
}
