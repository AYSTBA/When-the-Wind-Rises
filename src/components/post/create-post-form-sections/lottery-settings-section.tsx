"use client"

import { LotteryConditionValueField } from "@/components/post/lottery-condition-value-field"
import { Button } from "@/components/ui/rbutton"
import type { AccessThresholdOption } from "@/lib/access-threshold-options"
import { formatCompactNumber, formatCompactPointValue } from "@/lib/formatters"
import {
  LOTTERY_PRIZE_TYPE_OPTIONS,
  LOTTERY_VIP_PLAN_OPTIONS,
  getLotteryVipPlanDetails,
  normalizeLotteryRedemptionCodes,
  normalizeLotteryPrizeType,
  normalizeLotteryVipPlan,
} from "@/lib/lottery-prizes"
import type {
  LotteryConditionDraft,
  LotteryPrizeDraft,
} from "@/components/post/create-post-form.shared"
import {
  LOTTERY_CONDITION_CATEGORY_ORDER,
  LOTTERY_CONDITION_OPERATOR_OPTIONS,
  getLotteryConditionCategoryLabel,
  getLotteryConditionMeta,
  getLotteryConditionTypeOptions,
  lotteryConditionAllowsOperator,
  lotteryConditionRequiresValue,
  normalizeLotteryConditionGroupKey,
} from "@/components/post/create-post-form.shared"

function groupLotteryConditions(lotteryConditions: LotteryConditionDraft[]) {
  const groups = new Map<string, Array<{ index: number; condition: LotteryConditionDraft }>>()

  lotteryConditions.forEach((condition, index) => {
    const groupKey = normalizeLotteryConditionGroupKey(condition.groupKey)
    const groupItems = groups.get(groupKey) ?? []
    groupItems.push({ index, condition: { ...condition, groupKey } })
    groups.set(groupKey, groupItems)
  })

  return Array.from(groups.entries()).map(([groupKey, items]) => ({ groupKey, items }))
}

function calculateLotteryPrizeCost(
  prize: LotteryPrizeDraft,
  prices: { vipMonthlyPrice: number; vipQuarterlyPrice: number; vipYearlyPrice: number },
) {
  const quantity = Math.max(0, Math.trunc(Number(prize.quantity) || 0))
  if (quantity <= 0) {
    return 0
  }

  const type = normalizeLotteryPrizeType(prize.type)
  if (type === "POINTS") {
    return Math.max(0, Math.trunc(Number(prize.pointsAmount) || 0)) * quantity
  }

  if (type === "VIP") {
    return getLotteryVipPlanDetails(prize.vipPlan, prices).pointsCost * quantity
  }

  return 0
}

function calculateLotteryAutoPrizeCost(
  prizes: LotteryPrizeDraft[],
  prices: { vipMonthlyPrice: number; vipQuarterlyPrice: number; vipYearlyPrice: number },
) {
  return prizes.reduce((total, prize) => total + calculateLotteryPrizeCost(prize, prices), 0)
}

export function LotterySettingsSection(_props: Record<string, unknown>) {
  return null
}
