"use client"

import { useMemo } from "react"

const PIE_COLORS: Record<string, string> = {
  "很开心": "#4CAF50",
  "开心": "#8BC34A",
  "一般": "#FFC107",
  "低落": "#FF9800",
  "很失落": "#F44336",
}

const MOOD_LABELS: Record<string, string> = {
  "很开心": "😄 很开心",
  "开心": "😊 开心",
  "一般": "😐 一般",
  "低落": "😔 低落",
  "很失落": "😞 很失落",
}

interface MoodPieChartProps {
  distribution: Record<string, number>
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const startRad = ((startAngle - 90) * Math.PI) / 180
  const endRad = ((endAngle - 90) * Math.PI) / 180
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export function MoodPieChart({ distribution }: MoodPieChartProps) {
  const entries = useMemo(() => {
    return Object.entries(distribution).filter(([, count]) => count > 0)
  }, [distribution])

  const total = useMemo(() => entries.reduce((sum, [, c]) => sum + c, 0), [entries])

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-card py-12">
        <p className="text-sm text-muted-foreground">暂无心情数据</p>
      </div>
    )
  }

  const cx = 100
  const cy = 100
  const r = 90

  let currentAngle = 0
  const slices = entries.map(([mood, count]) => {
    const angle = (count / total) * 360
    const slice = {
      mood,
      count,
      percentage: ((count / total) * 100).toFixed(1),
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: PIE_COLORS[mood] ?? "#ccc",
    }
    currentAngle += angle
    return slice
  })

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-foreground">心情分布</h3>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg viewBox="0 0 200 200" className="size-44 shrink-0">
          {slices.map((slice) => (
            <path
              key={slice.mood}
              d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="white"
              strokeWidth={1.5}
            />
          ))}
          {/* Center hole for donut */}
          <circle cx={cx} cy={cy} r={50} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" className="fill-foreground text-lg font-bold" dominantBaseline="auto">
            {total}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">
            总计
          </text>
        </svg>

        <div className="flex flex-col gap-1.5">
          {slices.map((slice) => (
            <div key={slice.mood} className="flex items-center gap-2 text-sm">
              <span className="inline-block size-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="text-muted-foreground">{MOOD_LABELS[slice.mood] ?? slice.mood}</span>
              <span className="ml-auto tabular-nums text-foreground">{slice.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
