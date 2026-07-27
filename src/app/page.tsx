import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { getSiteSettings } from "@/lib/site-settings"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title: `${settings.siteName} · 心情`,
  }
}

export default function MoodPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex flex-1 flex-col items-center justify-center pt-32">
        <div className="text-center">
          <div className="mb-8 text-6xl">🌙</div>
          <h1 className="mb-2 text-2xl font-light tracking-wider text-foreground">
            心情页面
          </h1>
          <p className="text-sm text-muted-foreground">
            这里还没有任何内容
          </p>
        </div>
      </div>
    </div>
  )
}



