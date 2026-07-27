"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

export function SearchButton() {
  const pathname = usePathname()

  // 心情页面不显示搜索
  if (pathname === "/") {
    return null
  }

  return (
    <Link
      href="/search"
      className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-label="搜索"
    >
      <Search className="size-4" />
    </Link>
  )
}
