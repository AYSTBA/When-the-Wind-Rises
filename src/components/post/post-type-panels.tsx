"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/rbutton"
import { formatDateTime } from "@/lib/formatters"

interface BountyPanelProps {
  postId: string
  points: number
  pointName?: string
  isResolved: boolean
  acceptedAnswerAuthor?: string | null
}


interface PollPanelProps {
  postId: string
  totalVotes: number
  hasVoted: boolean
  expiresAt?: string | null
  options: Array<{
    id: string
    content: string
    voteCount: number
    percentage: number
    isVoted: boolean
  }>
}

interface LotteryPanelProps {
  postId: string
  isOwnerOrAdmin: boolean
  lottery: {
    status: string
    triggerMode: string
    renderedAt: string
    startsAt: string | null
    endsAt: string | null
    participantGoal: number | null
    participantCount: number
    lockedAt: string | null
    drawnAt: string | null
    announcement: string | null
    joined: boolean
    eligible: boolean
    ineligibleReason: string | null
    currentProbability: number | null
    participantPreviews: Array<{
      userId: number
      username: string
      nickname: string | null
      avatarPath: string | null
      joinedAt: string
    }>
    prizes: Array<{
      id: string
      title: string
      description: string
      quantity: number
      type: string
      pointsAmount: number | null
      vipPlan: string | null
      hasRedemptionCodes: boolean
      winnerCount: number
      winners: Array<{
        userId: number
        username: string
        nickname: string | null
        avatarPath: string | null
        redemptionCode: string | null
        drawnAt: string
      }>
    }>
    conditionGroups: Array<{
      key: string
      label: string
      conditions: Array<{
        id: string
        description: string | null
        matched: boolean | null
      }>
    }>
  }
}

export function BountyPanel(_props: BountyPanelProps) {
  return null
}

export function LotteryPanel(_props: LotteryPanelProps) {
  return null
}

export function PollPanel({ postId, totalVotes, hasVoted, expiresAt, options }: PollPanelProps) {

  const router = useRouter()
  const [message, setMessage] = useState("")
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const leadingOption = useMemo(() => {
    if (options.length === 0) {
      return null
    }

    return [...options].sort((left, right) => right.voteCount - left.voteCount)[0]
  }, [options])

  async function submitVote(optionId: string) {
    setLoadingId(optionId)
    setMessage("")

    const response = await fetch("/api/posts/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, optionId }),
    })

    const result = await response.json()
    setLoadingId(null)
    setMessage(result.message ?? (response.ok ? "投票成功" : "投票失败"))

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <div >
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold tracking-[0.06em] text-slate-950 dark:text-slate-200/95">投票</p>
            <span aria-hidden="true" className="h-px flex-1 bg-slate-300/90 dark:bg-border/80" />
            <span className="w-fit rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600 dark:bg-secondary/70 dark:text-slate-300">{hasVoted ? "已投票" : "未投票"}</span>
          </div>
          <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">共 {totalVotes} 人参与投票，每个账号只能选择一次。{expiresAt ? `截止时间：${formatDateTime(expiresAt)}` : "未设置截止时间，投票将长期开放。"}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5 sm:space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={option.isVoted
              ? "rounded-xl border border-sky-200/80 bg-sky-50 p-3.5 shadow-xs sm:p-4 dark:border-sky-500/20 dark:bg-slate-950/90 dark:shadow-none"
              : "rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:p-4 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none"}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-medium text-slate-950 dark:text-slate-100">{option.content}</p>
                  {option.isVoted ? <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">我的选择</span> : null}
                  {leadingOption?.id === option.id && totalVotes > 0 ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">当前领先</span> : null}
                  <span className="text-xs text-slate-500 dark:text-slate-300">{option.voteCount} 票 · 占比 {option.percentage}%</span>
                </div>
              </div>
              <Button type="button" variant={option.isVoted ? "default" : "outline"} disabled={hasVoted || Boolean(loadingId)} onClick={() => submitVote(option.id)} className="h-10 w-full sm:w-auto">
                {loadingId === option.id ? "提交中..." : option.isVoted ? "已选择" : hasVoted ? "已投票" : "投票"}
              </Button>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-sky-100 dark:bg-slate-800/80">
              <div className={option.isVoted ? "h-full rounded-full bg-sky-600 dark:bg-sky-400" : "h-full rounded-full bg-sky-500 dark:bg-sky-500/70"} style={{ width: `${Math.max(option.percentage, totalVotes > 0 ? 6 : 0)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {totalVotes === 0 ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">还没有人参与投票，快来投出第一票。</p> : null}
      {message ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">{message}</p> : null}
    </div>
  )
}
