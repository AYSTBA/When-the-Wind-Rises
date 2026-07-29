import { apiError, apiSuccess, createCustomRouteHandler, readJsonBody } from "@/lib/api-route"
import { recordMood } from "@/lib/mood-record-service"
import { getCurrentUser } from "@/lib/auth"

export const POST = createCustomRouteHandler(async ({ request, context: user }) => {
  let body: Record<string, unknown> | undefined

  try {
    body = await readJsonBody(request)
  } catch (error) {
    const message = error instanceof Error ? error.message : "请求体格式不正确"
    if (message !== "请求体必须为 JSON" && message !== "请求体格式不正确") {
      throw error
    }
  }

  const mood = typeof body?.mood === "string" ? body.mood.trim() : ""

  if (!mood) {
    return apiError(400, "请选择心情")
  }

  const result = await recordMood(mood)
  return apiSuccess(result)
}, {
  buildContext: async () => {
    const user = await getCurrentUser()
    if (!user) {
      apiError(401, "请先登录")
    }
    return user
  },
  errorMessage: "记录心情失败",
  logPrefix: "[api/mood-record:POST] unexpected error",
})
