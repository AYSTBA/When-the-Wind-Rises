"use client"

import { CircleHelp } from "lucide-react"
import { useMemo, type ReactNode } from "react"

import {
  AdminBooleanSelectField,
  SettingsSelectField as SelectField,
  SettingsInputField as TextField,
} from "@/components/admin/admin-settings-fields"
import { HEAT_COLOR_PRESETS } from "@/components/admin/admin-basic-settings.constants"
import type { AdminInteractionSettingsFormProps } from "@/components/admin/admin-basic-settings.types"

import { ColorPicker } from "@/components/ui/color-picker"
import { Tooltip } from "@/components/ui/tooltip"
import { COMMENT_LOAD_MODE_INFINITE, COMMENT_LOAD_MODE_PAGINATION } from "@/lib/comment-load-mode"
import { calculatePostHeatScore, resolvePostHeatStyle } from "@/lib/post-heat"

function parseNumberList(raw: string) {
  return raw
    .split(/[，,\s]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
}

function normalizeHeatThresholdsInput(raw: string) {
  const values = parseNumberList(raw).filter((item) => item >= 0)
  return Array.from(new Set(values)).sort((left, right) => left - right)
}

function InfoTextField(props: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helpText: string
}) {
  const { label, value, onChange, placeholder, helpText } = props

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">{label}</p>
        <Tooltip content={helpText} align="start" contentClassName="max-w-64 leading-6" enableMobileTap>
          <button
            type="button"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={`${label} 说明`}
          >
            <CircleHelp className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      </div>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-hidden"
      />
    </div>
  )
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
      <p className="text-sm font-semibold">{title}</p>
      {children}
    </div>
  )
}

export function AdminInteractionSettingsForm({
  activeSubTab,
  draft,
  updateDraftField,
}: AdminInteractionSettingsFormProps) {
  const previewSettings = useMemo(
    () => ({
      heatViewWeight: Number(draft.heatViewWeight) || 0,
      heatCommentWeight: Number(draft.heatCommentWeight) || 0,
      heatLikeWeight: Number(draft.heatLikeWeight) || 0,
      heatTipCountWeight: Number(draft.heatTipCountWeight) || 0,
      heatTipPointsWeight: Number(draft.heatTipPointsWeight) || 0,
      heatStageThresholds: normalizeHeatThresholdsInput(draft.heatStageThresholds),
      heatStageColors: draft.heatStageColors,
    }),
    [
      draft.heatCommentWeight,
      draft.heatLikeWeight,
      draft.heatStageColors,
      draft.heatStageThresholds,
      draft.heatTipCountWeight,
      draft.heatTipPointsWeight,
      draft.heatViewWeight,
    ],
  )

  const previewInput = useMemo(
    () => ({
      views: Number(draft.previewViews) || 0,
      comments: Number(draft.previewComments) || 0,
      likes: Number(draft.previewLikes) || 0,
      tipCount: Number(draft.previewTipCount) || 0,
      tipPoints: Number(draft.previewTipPoints) || 0,
    }),
    [
      draft.previewComments,
      draft.previewLikes,
      draft.previewTipCount,
      draft.previewTipPoints,
      draft.previewViews,
    ],
  )

  const previewScore = useMemo(
    () => calculatePostHeatScore(previewInput, previewSettings),
    [previewInput, previewSettings],
  )
  const previewHeat = useMemo(
    () => resolvePostHeatStyle(previewInput, previewSettings),
    [previewInput, previewSettings],
  )

  function updateHeatColor(index: number, nextColor: string) {
    updateDraftField(
      "heatStageColors",
      draft.heatStageColors.map((item, currentIndex) =>
        currentIndex === index ? nextColor : item,
      ),
    )
  }

  return (
    <>
      {activeSubTab === "access" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">风广场访问控制</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">控制游客是否可以直接浏览风广场内容页。登录、注册、帮助、公告和静态资源不受影响。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminBooleanSelectField
              label="必须登录后浏览风广场内容"
              checked={draft.forumRequireLoginToBrowse}
              onChange={(value) => updateDraftField("forumRequireLoginToBrowse", value)}
              description="开启后，游客访问首页、列表、风笺、版块、节点、标签、搜索和用户页时会跳转登录页。"
            />
          </div>
        </div>
      ) : null}

      {activeSubTab === "comments" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">评论展示</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">控制评论区可见性、楼中楼默认展开数量，以及风笺详情页的评论分页容量。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminBooleanSelectField label="游客可查看评论" checked={draft.guestCanViewComments} onChange={(value) => updateDraftField("guestCanViewComments", value)} />
            <TextField label="楼中楼默认展开条数" value={draft.commentInitialVisibleReplies} onChange={(value) => updateDraftField("commentInitialVisibleReplies", value)} placeholder="如 10" />
            <TextField label="评论区一页显示数" value={draft.commentPageSize} onChange={(value) => updateDraftField("commentPageSize", value)} placeholder="如 15" />
            <TextField label="评论点赞自动神评阈值" value={draft.godCommentAutoLikeThreshold} onChange={(value) => updateDraftField("godCommentAutoLikeThreshold", value)} placeholder="如 10" />
            <SelectField
              label="评论加载方式"
              value={draft.commentLoadMode}
              onChange={(value) => updateDraftField("commentLoadMode", value === COMMENT_LOAD_MODE_INFINITE ? COMMENT_LOAD_MODE_INFINITE : COMMENT_LOAD_MODE_PAGINATION)}
              options={[
                { value: COMMENT_LOAD_MODE_PAGINATION, label: "数字分页" },
                { value: COMMENT_LOAD_MODE_INFINITE, label: "无限下拉" },
              ]}
            />
          </div>
          <p className="text-xs leading-6 text-muted-foreground">楼中楼超过默认展开条数后，前台会显示“展开其余 X 条回复”；评论区一页显示数控制主评论分页容量，无限下拉会按同样数量逐页追加。</p>
        </div>
      ) : null}

      {activeSubTab === "mentions" ? (
        <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
          <div>
            <h3 className="text-sm font-semibold">@ 默认推荐</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">控制编辑器输入空白 @ 时优先展示的用户。填写后只显示这份名单；留空时继续使用 AI 账号和管理成员作为默认推荐。</p>
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">默认推荐用户名</span>
            <textarea
              value={draft.mentionDefaultUsernames}
              onChange={(event) => updateDraftField("mentionDefaultUsernames", event.target.value)}
              placeholder="每行一个用户名，也可用逗号分隔；例如 admin"
              className="min-h-36 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm leading-6 outline-hidden"
            />
          </label>
          <p className="text-xs leading-6 text-muted-foreground">只接受 3-20 位字母、数字或下划线用户名，最多保存 20 个；不存在、被禁用或当前登录用户本人会在前台自动过滤。</p>
        </div>
      ) : null}

      {activeSubTab === "chat" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">全站聊天室</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">控制站内私信页里的全站聊天室入口和公共聊天功能。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminBooleanSelectField label="开启全站聊天室" checked={draft.siteChatEnabled} onChange={(value) => updateDraftField("siteChatEnabled", value)} />
          </div>
          <p className="text-xs leading-6 text-muted-foreground">开启后，站内私信页会在会话列表首位显示聊天室入口；关闭后仅保留普通私信会话。</p>
        </div>
      ) : null}

      {activeSubTab === "content-limits" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">发笺、回复与编辑限制</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">分别控制标题、正文、回复的字数范围，以及风笺和评论的可编辑时长，服务端会按这里的值做校验。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TextField label="发笺标题最小字数" value={draft.postTitleMinLength} onChange={(value) => updateDraftField("postTitleMinLength", value)} placeholder="默认 5，最小 1" />
            <TextField label="发笺标题最大字数" value={draft.postTitleMaxLength} onChange={(value) => updateDraftField("postTitleMaxLength", value)} placeholder="默认 100，最大 500" />
            <TextField label="发笺正文最小字数" value={draft.postContentMinLength} onChange={(value) => updateDraftField("postContentMinLength", value)} placeholder="默认 10，最小 1" />
            <TextField label="发笺正文最大字数" value={draft.postContentMaxLength} onChange={(value) => updateDraftField("postContentMaxLength", value)} placeholder="默认 50000，最大 100000" />
            <TextField label="回复正文最小字数" value={draft.commentContentMinLength} onChange={(value) => updateDraftField("commentContentMinLength", value)} placeholder="默认 2，最小 1" />
            <TextField label="回复正文最大字数" value={draft.commentContentMaxLength} onChange={(value) => updateDraftField("commentContentMaxLength", value)} placeholder="默认 2000，最大 20000" />
            <TextField label="风笺可编辑分钟数" value={draft.postEditableMinutes} onChange={(value) => updateDraftField("postEditableMinutes", value)} placeholder="如 10，-1 为永久" />
            <TextField label="评论可编辑分钟数" value={draft.commentEditableMinutes} onChange={(value) => updateDraftField("commentEditableMinutes", value)} placeholder="如 5" />
          </div>
          <p className="text-xs leading-6 text-muted-foreground">保存时若最大值小于最小值，会自动按最小值兜底；发笺、编辑风笺、回复、编辑回复都会使用这组限制。风笺可编辑分钟数填 `-1` 表示永久可编辑，填 `0` 表示发出后不可再编辑。</p>
        </div>
      ) : null}

      {activeSubTab === "anonymous-post" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">匿名发笺</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">控制匿名发笺开关、扣费、每日次数，以及匿名帖下回复时是否允许切换身份。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminBooleanSelectField label="开启匿名发笺" checked={draft.anonymousPostEnabled} onChange={(value) => updateDraftField("anonymousPostEnabled", value)} />
            <AdminBooleanSelectField label="匿名回复可切换身份" checked={draft.anonymousPostAllowReplySwitch} onChange={(value) => updateDraftField("anonymousPostAllowReplySwitch", value)} />
            <AdminBooleanSelectField label="匿名帖默认匿名回复" checked={draft.anonymousPostDefaultReplyAnonymous} onChange={(value) => updateDraftField("anonymousPostDefaultReplyAnonymous", value)} />
            <TextField label="匿名发笺价格" value={draft.anonymousPostPrice} onChange={(value) => updateDraftField("anonymousPostPrice", value)} placeholder="如 20" />
            <TextField label="每日匿名发笺次数" value={draft.anonymousPostDailyLimit} onChange={(value) => updateDraftField("anonymousPostDailyLimit", value)} placeholder="0 表示不限制" />
            <TextField label="匿名马甲用户 ID" value={draft.anonymousPostMaskUserId} onChange={(value) => updateDraftField("anonymousPostMaskUserId", value)} placeholder="如 10001" />
          </div>
          <p className="text-xs leading-6 text-muted-foreground">匿名发笺当前只用于普通帖和投票帖。启用后会按配置风铃扣费，前台展示为指定马甲账号，风笺真实作者仍保留原账号。</p>
        </div>
      ) : null}

      {activeSubTab === "tipping" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">风笺打赏与送礼</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">控制风笺打赏开关、次数限制、裸风铃档位、礼物配置，以及打赏送礼税。</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            打赏功能已关闭
          </div>
        </div>
      ) : null}

      {activeSubTab === "gates" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">发布门槛</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">按发笺和回复分别控制邮箱验证、手机验证与注册时长门槛。后续新的互动验证规则也会继续挂在这一层扩展，不需要再改主设置表。</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <FieldGroup title="发笺">
              <AdminBooleanSelectField label="发笺需已验证邮箱" checked={draft.postCreateRequireEmailVerified} onChange={(value) => updateDraftField("postCreateRequireEmailVerified", value)} />
              <AdminBooleanSelectField label="发笺需已验证手机" checked={draft.postCreateRequirePhoneVerified} onChange={(value) => updateDraftField("postCreateRequirePhoneVerified", value)} />
              <TextField label="注册满多少分钟才能发笺" value={draft.postCreateMinRegisteredMinutes} onChange={(value) => updateDraftField("postCreateMinRegisteredMinutes", value)} placeholder="填 0 表示不限制" />
            </FieldGroup>
            <FieldGroup title="回复">
              <AdminBooleanSelectField label="回复需已验证邮箱" checked={draft.commentCreateRequireEmailVerified} onChange={(value) => updateDraftField("commentCreateRequireEmailVerified", value)} />
              <AdminBooleanSelectField label="回复需已验证手机" checked={draft.commentCreateRequirePhoneVerified} onChange={(value) => updateDraftField("commentCreateRequirePhoneVerified", value)} />
              <TextField label="注册满多少分钟才能回复" value={draft.commentCreateMinRegisteredMinutes} onChange={(value) => updateDraftField("commentCreateMinRegisteredMinutes", value)} placeholder="填 0 表示不限制" />
            </FieldGroup>
          </div>
          <p className="text-xs leading-6 text-muted-foreground">邮箱和手机门槛分别校验账号的 `emailVerifiedAt`、`phoneVerifiedAt`；分钟门槛按注册时间到当前时间计算，`0` 表示关闭该限制。</p>
        </div>
      ) : null}

      {activeSubTab === "reward-pool" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">风笺红包与聚宝盆</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">红包用于一次性预存发放；聚宝盆用于回复后给风铃池注入风铃，并按概率抽中奖励。</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            红包与聚宝盆功能已关闭
          </div>
        </div>
      ) : null}

      {activeSubTab === "heat" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">风笺热度颜色算法</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">统一配置热度分数计算权重、首页热门近活跃窗口与颜色阶段。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TextField label="首页热门近活跃窗口（小时）" value={draft.homeHotRecentWindowHours} onChange={(value) => updateDraftField("homeHotRecentWindowHours", value)} placeholder="如 72" />
          </div>
          <p className="text-xs leading-6 text-muted-foreground">首页“热门”会优先显示近 N 小时内有活动的风笺，再按历史热度补位。建议保持在 `24-168` 小时之间；填写 `72` 即当前默认策略。</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TextField label="浏览权重" value={draft.heatViewWeight} onChange={(value) => updateDraftField("heatViewWeight", value)} placeholder="如 1" />
            <TextField label="回复权重" value={draft.heatCommentWeight} onChange={(value) => updateDraftField("heatCommentWeight", value)} placeholder="如 8" />
            <TextField label="点赞权重" value={draft.heatLikeWeight} onChange={(value) => updateDraftField("heatLikeWeight", value)} placeholder="如 6" />
          </div>
          <TextField label="9 段热度阈值" value={draft.heatStageThresholds} onChange={(value) => updateDraftField("heatStageThresholds", value)} placeholder="如 0,80,180,320,520,780,1100,1500,2000" />
          <div className="space-y-2">
            <p className="text-sm font-medium">9 段颜色色板</p>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {draft.heatStageColors.map((color, index) => (
                <div key={`heat-color-${index}`} className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-foreground">第 {index + 1} 档颜色</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">阈值 ≥ {previewSettings.heatStageThresholds[index] ?? 0}</p>
                    </div>
                    <ColorPicker
                      value={color}
                      onChange={(value) => updateHeatColor(index, value)}
                      hideLabel
                      presets={HEAT_COLOR_PRESETS}
                      fallbackColor="#4A4A4A"
                      placeholder="#4A4A4A"
                      popoverTitle={`选择第 ${index + 1} 档颜色`}
                      containerClassName="w-[148px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeSubTab === "preview" ? (
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">热度预览面板</h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">调整参数后，实时预览热度分数与颜色表现。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TextField label="浏览数" value={draft.previewViews} onChange={(value) => updateDraftField("previewViews", value)} placeholder="如 120" />
            <TextField label="回复数" value={draft.previewComments} onChange={(value) => updateDraftField("previewComments", value)} placeholder="如 18" />
            <TextField label="点赞数" value={draft.previewLikes} onChange={(value) => updateDraftField("previewLikes", value)} placeholder="如 12" />
          </div>
          <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
            <div className="rounded-xl border border-border bg-card px-4 py-4">
              <p className="text-xs text-muted-foreground">热度分数</p>
              <p className="mt-2 text-3xl font-semibold">{previewScore}</p>
              <p className="mt-2 text-xs text-muted-foreground">当前落在第 {previewHeat.stageIndex + 1} 档颜色</p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-4">
              <p className="text-xs text-muted-foreground">回复数按钮预览</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: `${previewHeat.color}14`, color: previewHeat.color }}>
                  💬 {previewInput.comments}
                </span>
                <span className="text-sm text-muted-foreground">颜色：{previewHeat.color}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
