"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, LayoutGrid } from "lucide-react"

import { cn } from "@/lib/utils"

const dockItems = [
  { href: "/", label: "心情", icon: Sparkles },
  { href: "/hot", label: "广场", icon: LayoutGrid },
]

export function MobileBottomDock() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/70 bg-background/90 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex h-14 max-w-[500px] items-center justify-around px-4">
        {dockItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
