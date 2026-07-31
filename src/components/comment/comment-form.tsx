"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/rbutton"
import { toast } from "@/components/ui/toast"
import { COMMENT_LOAD_MODE_INFINITE, COMMENT_LOAD_MODE_PAGINATION, type CommentLoadMode } from "@/lib/comment-load-mode"
import { buildCommentNavigationUrl } from "@/lib/comment-navigation"
import { dispatchPostReplyCreated } from "@/lib/post-discussion-events"
import type { MarkdownEmojiItem } from "@/lib/markdown-emoji"
import type { PrivateReplyRecipient } from "@/components/refined-rich-post-editor/types"
import { cn } from "@/lib/utils"

interface CommentFormProps {
  postId: string
  commentId?: string
  initialContent?: string
  mode?: "create" | "edit"
  editWindowMinutes?: number
  parentId?: string
  replyToUserName?: string
  replyToCommentId?: string
  compact?: boolean
  onCancel?: () => void
  onSubmitted?: () => void
  disabledMessage?: string | null
  commentsVisibleToAuthorOnly?: boolean
  anonymousIdentityEnabled?: boolean
  anonymousIdentityDefaultChecked?: boolean
  anonymousIdentitySwitchVisible?: boolean
  markdownEmojiMap?: MarkdownEmojiItem[]
  embedded?: boolean
  commentLoadMode?: CommentLoadMode
}

function getInitialCommentContent(initialContent: string, mode: CommentFormProps["mode"], replyToUserName?: string) {
  if (mode !== "create" || !replyToUserName) {
    return initialContent
  }

  const prefix = `@${replyToUserName} `
  return initialContent.startsWith(prefix) ? initialContent : `${prefix}${initialContent}`.trimStart()
}

function getCommentFormStateKey({
  commentId,
  initialContent = "",
  mode = "create",
  replyToUserName,
  anonymousIdentityDefaultChecked = false,
}: CommentFormProps) {
  return JSON.stringify([commentId ?? "", initialContent, mode, replyToUserName ?? "", anonymousIdentityDefaultChecked])
}

export function CommentForm(props: CommentFormProps) {
  return <CommentFormContent key={getCommentFormStateKey(props)} {...props} />
}

function CommentFormContent({ postId, commentId, initialContent = "", mode = "create", editWindowMinutes = 5, parentId, replyToUserName, replyToCommentId, compact = false, onCancel, onSubmitted, disabledMessage, commentsVisibleToAuthorOnly = false, anonymousIdentityEnabled = false, anonymousIdentityDefaultChecked = false, anonymousIdentitySwitchVisible = false, markdownEmojiMap, embedded = false, commentLoadMode = COMMENT_LOAD_MODE_PAGINATION }: CommentFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [content, setContent] = useState(() => getInitialCommentContent(initialContent, mode, replyToUserName))
  const [privateReplyRecipient, setPrivateReplyRecipient] = useState<PrivateReplyRecipient | null>(null)
  const [useAnonymousIdentity, setUseAnonymousIdentity] = useState(anonymousIdentityDefaultChecked)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(mode === "edit" || !compact || (mode === "create" && Boolean(replyToUserName)))

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageUploading, setImageUploading] = useState(false)

  const builtContent = content + (imageUrls.length > 0 ? "\n\n" + imageUrls.map((url) => `![](${url})`).join("\n\n") : "")

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setImageUploading(true)
    try {
      const newUrls = [...imageUrls]
      for (const rawFile of files) {
        const formData = new FormData()
        formData.append("file", rawFile)
        formData.append("folder", "comments")

        const res = await fetch("/api/upload", { method: "POST", body: formData })
        if (!res.ok) continue

        const result = await res.json() as { data?: { urlPath?: string } }
        const urlPath = result.data?.urlPath
        if (!urlPath) continue

        newUrls.push(urlPath)
      }
      if (newUrls.length !== imageUrls.length) {
        setImageUrls(newUrls)
      }
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleImageRemove = (targetUrl: string) => {
    setImageUrls((prev) => prev.filter((url) => url !== targetUrl))
  }

  const helperMessage = privateReplyRecipient
    ? `本次回复仅 ${privateReplyRecipient.displayName} 和你本人可见。`
    : commentsVisibleToAuthorOnly
    ? "当前风笺开启了评论仅楼主可见，你的评论仅楼主、管理员和你自己可见。"
    : "可使用 @昵称/用户名 提及他人。"
  const formClassName = compact
    ? "min-w-0 w-full max-w-full flex flex-col gap-3 overflow-x-hidden rounded-[18px] border border-border bg-card p-4"
    : embedded
      ? "min-w-0 w-full max-w-full flex flex-col gap-3 overflow-x-hidden pb-4 pt-3"
      : "min-w-0 w-full max-w-full flex flex-col gap-4 overflow-x-hidden"

  function handleSubmitShortcut(event: React.KeyboardEvent<HTMLFormElement>) {
    if (loading || disabledMessage) {
      return
    }

    if (event.nativeEvent.isComposing) {
      return
    }

    if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
      return
    }

    if (event.key !== "Enter") {
      return
    }

    if (!(event.target instanceof HTMLTextAreaElement) || event.target.disabled) {
      return
    }

    event.preventDefault()
    event.currentTarget.requestSubmit()
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    const response = await fetch(mode === "edit" ? "/api/comments/update" : "/api/comments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mode === "edit" ? { postId, commentId, content: builtContent } : {
        postId,
        content: builtContent,
        parentId,
        replyToUserName,
        replyToCommentId,
        privateRecipientUserId: privateReplyRecipient?.id ?? null,
        useAnonymousIdentity,
        commentView: searchParams.get("view") === "flat" ? "flat" : "tree",
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const errorMessage = result.message ?? (mode === "edit" ? "评论编辑失败" : "评论失败")
      setMessage(errorMessage)
      toast.error(errorMessage, mode === "edit" ? "编辑失败" : parentId ? "回复失败" : "评论失败")
      setLoading(false)
      return
    }

    if (mode !== "edit") {
      setContent("")
      setImageUrls([])
      setPrivateReplyRecipient(null)
    }

    const successMessage = mode === "edit" ? "评论修改成功" : parentId ? "回复提交成功" : "评论提交成功"
    const navigation = result.data?.navigation as { page?: number; sort?: string; view?: string; anchor?: string } | undefined
    const nextUrl = navigation
      ? buildCommentNavigationUrl({
          pathname,
          searchParams,
          navigation: commentLoadMode === COMMENT_LOAD_MODE_INFINITE
            ? { anchor: navigation.anchor }
            : navigation,
          commentLoadMode,
        })
      : null

    setMessage(successMessage)
    toast.success(successMessage, mode === "edit" ? "编辑成功" : parentId ? "回复成功" : "评论成功")
    setExpanded(!compact)
    setLoading(false)

    if (mode === "edit") {
      onCancel?.()
      router.refresh()
      return
    }

    onCancel?.()
    onSubmitted?.()

    if (typeof result.data?.id === "string") {
      dispatchPostReplyCreated({
        postId,
        commentId: result.data.id,
        reviewRequired: Boolean(result.data?.reviewRequired),
      })
    }

    if (nextUrl) {
      router.replace(nextUrl)
      router.refresh()
      return
    }

    router.refresh()
  }

  if (compact && !expanded) {
    return (
      <button type="button" onClick={() => setExpanded(true)} className="text-sm text-primary transition-opacity hover:opacity-80" disabled={Boolean(disabledMessage)}>
        回复
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleSubmitShortcut} className={formClassName}>
      {disabledMessage ? <div className={cn("rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800", embedded && "mx-4")}>{disabledMessage}</div> : null}
      <div className={cn("relative flex flex-col", embedded ? "rounded-none border-0 bg-transparent" : "rounded-[18px] border border-border bg-card")}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={Boolean(disabledMessage)}
          placeholder={mode === "edit" ? `修改评论内容…可在 ${editWindowMinutes} 分钟内编辑` : replyToUserName ? `回复 @${replyToUserName}…` : "写下你的回复…"}
          rows={4}
          className="w-full resize-none bg-transparent px-4 pt-3 text-sm leading-6 outline-hidden transition-colors placeholder:text-muted-foreground/50 disabled:opacity-50"
        />
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {imageUrls.map((url) => (
              <div key={url} className="group relative size-16 overflow-hidden rounded-xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleImageRemove(url)}
                  className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-2.5">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
            disabled={imageUploading || Boolean(disabledMessage)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading || Boolean(disabledMessage)}
            className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground transition-colors hover:bg-muted/70 disabled:opacity-50"
            title="添加图片"
          >
            {imageUploading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", embedded && "px-4")}>
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : (
          <span className="text-xs text-muted-foreground">{helperMessage}</span>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2">
          {mode === "create" && anonymousIdentityEnabled && anonymousIdentitySwitchVisible ? (
            <label className="mr-auto inline-flex items-center gap-2 text-xs text-muted-foreground sm:mr-0">
              <input type="checkbox" checked={useAnonymousIdentity} onChange={(event) => setUseAnonymousIdentity(event.target.checked)} className="h-4 w-4" />
              继续使用匿名身份回复
            </label>
          ) : null}
          {(compact || replyToUserName || mode === "edit") ? (
            <Button type="button" variant="ghost" onClick={() => {
              setExpanded(false)
              setContent(initialContent)
              setPrivateReplyRecipient(null)
              onCancel?.()
            }}>
              取消
            </Button>
          ) : null}
          <Button disabled={loading || Boolean(disabledMessage)}>{loading ? "提交中..." : mode === "edit" ? "保存修改" : privateReplyRecipient ? "发布私密回复" : parentId ? "提交回复" : "提交评论"}</Button>
        </div>
      </div>
    </form>
  )
}
