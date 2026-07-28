import { apiSuccess, createRouteHandler } from "@/lib/api-route"
import { getHomepagePosts } from "@/lib/posts"

export const GET = createRouteHandler(async () => {
  const posts = await getHomepagePosts()
  return apiSuccess(posts, "success")
}, {
  errorMessage: "获取风笺列表失败",
  logPrefix: "[api/posts] unexpected error",
})

