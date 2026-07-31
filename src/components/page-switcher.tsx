"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const TABS = [
  { label: "心情", href: "/", match: (p: string) => p === "/" },
  { label: "风屋", href: "/house", match: (p: string) => p.startsWith("/house") },
  { label: "风广场", href: "/forum", match: (p: string) => p.startsWith("/forum") || p.startsWith("/users") },
] as const

export function PageSwitcher() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted/60 p-0.5">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            tab.match(pathname)
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
