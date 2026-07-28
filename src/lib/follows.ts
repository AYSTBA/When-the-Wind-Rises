import { findFollowRecord, FOLLOW_TARGET_TYPES, type FollowTargetType } from "@/db/follow-queries"

export { FOLLOW_TARGET_TYPES }
export type { FollowTargetType }

export const FOLLOW_TARGET_COPY: Record<FollowTargetType, {
  noun: string
  followAction: string
  unfollowAction: string
}> = {
  board: {
    noun: "节点",
    followAction: "关注节点",
    unfollowAction: "取消关注节点",
  },
  user: {
    noun: "用户",
    followAction: "关注用户",
    unfollowAction: "取消关注用户",
  },
  tag: {
    noun: "标签",
    followAction: "关注标签",
    unfollowAction: "取消关注标签",
  },
  post: {
    noun: "风笺",
    followAction: "关注风笺",
    unfollowAction: "取消关注风笺",
  },
}

export function normalizeFollowTargetType(value: string): FollowTargetType | null {
  return FOLLOW_TARGET_TYPES.includes(value as FollowTargetType) ? value as FollowTargetType : null
}

export function getFollowTargetCopy(targetType: FollowTargetType) {
  return FOLLOW_TARGET_COPY[targetType]
}

export async function isUserFollowingTarget(params: {
  userId: number
  targetType: FollowTargetType
  targetId: string | number
}) {
  const follow = await findFollowRecord(params)
  return Boolean(follow)
}
