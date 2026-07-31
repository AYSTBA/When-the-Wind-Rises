/**
 * 将 Rhex 社区迁移为百度贴吧风格
 * - 站点名称改为 "XX谈"
 * - 只保留一个 "主谈" 节点（原"综合讨论"）
 * - 删除多余的公告、反馈建议节点
 * - 关闭不需要的功能提升性能
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 开始迁移为贴吧风格...\n")

  // 1. 更新站点设置
  const settings = await prisma.siteSetting.findFirst({ orderBy: { createdAt: "asc" } })
  if (!settings) {
    console.error("❌ 未找到站点设置")
    return
  }

  await prisma.siteSetting.update({
    where: { id: settings.id },
    data: {
      siteName: "XX谈",
      siteSlogan: "畅所欲言，交流分享",
      siteDescription: "一个自由交流的社区平台",
      siteLogoText: "XX谈",
      siteSeoKeywords: "论坛,社区,交流,讨论",
      footerLinksJson: JSON.stringify([
        { label: "关于", href: "/about" },
        { label: "帮助", href: "/help" },
        { label: "协议", href: "/terms" },
      ]),
    },
  })
  console.log("✅ 站点设置已更新: XX谈")

  // 2. 获取当前分区
  const zone = await prisma.zone.findFirst({
    where: { slug: "general" },
  })

  if (!zone) {
    console.error("❌ 未找到默认分区")
    return
  }

  // 3. 更新分区名称为 "主谈"
  await prisma.zone.update({
    where: { id: zone.id },
    data: {
      name: "主谈",
      description: "主要讨论区，畅所欲言",
      icon: "💬",
    },
  })
  console.log("✅ 分区已重命名为: 主谈")

  // 4. 获取所有板块
  const boards = await prisma.board.findMany({
    where: { zoneId: zone.id },
  })

  // 5. 只保留一个"综合讨论"板块，重命名为"主谈"，删除其他
  const mainBoard = boards.find(b => b.slug === "general-discussion")

  if (mainBoard) {
    await prisma.board.update({
      where: { id: mainBoard.id },
      data: {
        name: "主谈",
        description: "主要讨论区，畅所欲言",
        iconPath: "💬",
        sortOrder: 1,
      },
    })
    console.log("✅ 主板块已重命名为: 主谈")
  }

  // 6. 删除多余的板块（公告、反馈建议）
  const boardsToDelete = boards.filter(b => b.slug !== "general-discussion")

  for (const board of boardsToDelete) {
    // 先删除该板块下的所有帖子
    const postsInBoard = await prisma.post.findMany({
      where: { boardId: board.id },
      select: { id: true },
    })

    if (postsInBoard.length > 0) {
      const postIds = postsInBoard.map(p => p.id)

      // 删除评论
      await prisma.comment.deleteMany({
        where: { postId: { in: postIds } },
      })

      // 删除点赞
      await prisma.like.deleteMany({
        where: { postId: { in: postIds } },
      })

      // 删除收藏
      await prisma.favorite.deleteMany({
        where: { postId: { in: postIds } },
      })

      // 删除帖子
      await prisma.post.deleteMany({
        where: { boardId: board.id },
      })
    }

    // 删除板块
    await prisma.board.delete({
      where: { id: board.id },
    })
    console.log(`🗑️  已删除板块: ${board.name}`)
  }

  // 7. 关闭一些不需要的功能
  const appState = JSON.parse(settings.appStateJson || "{}")
  appState.__siteSettings = appState.__siteSettings || {}

  // 关闭左侧边栏显示（贴吧风格不需要）
  appState.__siteSettings.leftSidebarDisplay = {
    mode: "HIDDEN",
  }

  await prisma.siteSetting.update({
    where: { id: settings.id },
    data: {
      appStateJson: JSON.stringify(appState),
      // 关闭一些不需要的功能
      homeSidebarStatsCardEnabled: false,


      checkInEnabled: false,
      registrationRequireInviteCode: false,
      registerInviteCodeEnabled: false,
      inviteCodePurchaseEnabled: false,
    },
  })
  console.log("✅ 已关闭不需要的功能")

  // 8. 完成
  console.log("\n🎉 迁移完成！")
  console.log("站点名称: XX谈")
  console.log("主板块: 主谈")
  console.log("已删除多余的公告、反馈建议板块")
  console.log("已关闭签到、友情链接等不需要的功能")
  console.log("\n请重启开发服务器查看效果: pnpm run dev")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error("❌ 迁移失败:", error)
    await prisma.$disconnect()
    process.exit(1)
  })
