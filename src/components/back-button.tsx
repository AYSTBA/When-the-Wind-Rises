"use client"

import { ArrowLeft } from "lucide-react"

export function BackButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={className ?? "inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted transition-colors"}
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  )
}
