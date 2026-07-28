"use client"

interface VipActionPanelProps {
  vipMonthlyPrice: number
  vipQuarterlyPrice: number
  vipYearlyPrice: number
  pointName: string
  userPoints?: number
  vipExpiresAt?: string | null
}

export function VipActionPanel(_props: VipActionPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">VIP 购买功能已关闭</p>
    </div>
  )
}
