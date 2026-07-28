"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function PageSwitcher() {
  const pathname = usePathname()
  const isForum = pathname !== "/"

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted/60 p-0.5">
      <Link
        href="/"
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !isForum
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        心情
      </Link>
      <Link
        href="/forum"
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          isForum
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        风广场
      </Link>
    </div>
  )
}
