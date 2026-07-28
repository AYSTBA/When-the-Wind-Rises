import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass, Crown, FileText, HeartHandshake, LibraryBig, MessageSquareText, Scale, ShieldAlert, Sparkles } from "lucide-react"

import { AddonSlotRenderer, AddonSurfaceRenderer } from "@/addons-host"
import { CustomPageRenderer } from "@/components/custom-page-renderer"
import { ForumPageShell } from "@/components/forum/forum-page-shell"
import { buildHomeSidebarCurrentUserSettings, HomeSidebarPanels } from "@/components/home/home-sidebar-panels"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getHomeAnnouncements } from "@/lib/announcements"

import { getBoards } from "@/lib/boards"
import { getPublishedCustomPageByPath } from "@/lib/custom-pages"
import { stripCustomPageHtmlToText } from "@/lib/custom-page-types"
import { getHomeSidebarHotTopics } from "@/lib/home-sidebar"
import { getSiteSettings } from "@/lib/site-settings"
import { getZones } from "@/lib/zones"

const principles = [

  {
    icon: Compass,
    title: "兴趣优先",
    description: "我们相信，真正可持续的社区，不靠追热点，而靠长期稳定的兴趣沉淀与真实交流。",
  },
  {
    icon: LibraryBig,
    title: "经验可复用",
    description: "从新手入门、装备选择到进阶实践，把零散经验整理成别人也能看懂、能接住的内容。",
  },
  {
    icon: HeartHandshake,
    title: "交流有分寸",
    description: "鼓励表达，也尊重差异。比起情绪化争吵，我们更欢迎具体、克制、有信息量的讨论。",
  },
]

const highlights = [
  {
    icon: Sparkles,
    title: "找到同频的人",
    description: "无论你热爱器材、技术、手作还是生活方式，都能在这里找到愿意认真交流的人。",
  },
  {
    icon: MessageSquareText,
    title: "把想做的事真的做起来",
    description: "从一句提问、一篇分享，到一次长期记录，让兴趣从“以后再说”变成正在发生。",
  },
]

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const [settings, customPage] = await Promise.all([
    getSiteSettings(),
    getPublishedCustomPageByPath("/about"),
  ])

  if (customPage) {
    const description = stripCustomPageHtmlToText(customPage.htmlContent, 120) || settings.siteDescription

    return {
      title: `${customPage.title} - ${settings.siteName}`,
      description,
      openGraph: {
        title: `${customPage.title} - ${settings.siteName}`,
        description,
        type: "website",
      },
    }
  }

  return {
    title: `关于我们 - ${settings.siteName}`,
    description: `了解 ${settings.siteName} 的定位、氛围与社区愿景。`,
    openGraph: {
      title: `关于我们 - ${settings.siteName}`,
      description: settings.siteDescription,
      type: "website",
    },
  }
}

export default async function AboutPage() {
  const customPage = await getPublishedCustomPageByPath("/about")
  if (customPage) {
    return <CustomPageRenderer page={customPage} routePath="/about" />
  }

  const settingsPromise = getSiteSettings()
  const [settings, boards, zones, hotTopics,announcements] = await Promise.all([
    settingsPromise,
    getBoards(),
    getZones(),
    settingsPromise.then((settings) => getHomeSidebarHotTopics(settings.homeSidebarHotTopicsCount)),
    getHomeAnnouncements(3),
  ])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-[1200px] px-1">
        <ForumPageShell
          zones={zones}
          boards={boards}
          main={(
            <main className="py-1 pb-12 mt-6">
              <div className="space-y-6 ">
          <AddonSlotRenderer slot="about.page.before" />
          <AddonSurfaceRenderer surface="about.page" props={{ settings }}>
            <>
          <AddonSlotRenderer slot="about.hero.before" />
          <AddonSurfaceRenderer surface="about.hero" props={{ settings }}>
            <section className="rounded-xl border border-border bg-card px-5 py-6 shadow-xs sm:px-7 sm:py-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  About {settings.siteName}
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  一个围绕长期兴趣、真实经验与克制交流建立的社区。
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {settings.siteName} 不是一个只追逐流量的内容广场，而是一个让兴趣爱好真正落地、生长并被认真讨论的地方。
                  我们希望把 {settings.siteDescription} 这件事，做成一个可以长期回访、持续积累的线上社区。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  现在加入
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/funs"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  浏览全部节点
                </Link>
              </div>
            </div>
          </section>
          </AddonSurfaceRenderer>
          <AddonSlotRenderer slot="about.hero.after" />

          <AddonSlotRenderer slot="about.highlights.before" />
          <AddonSurfaceRenderer surface="about.highlights" props={{ highlights, settings }}>
            <section className="grid gap-5 2xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-xl">这是什么样的社区</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  {settings.siteName} 更适合那些不满足于碎片化刷内容，而是想认真了解一个爱好、记录一次实践、分享一套经验的人。
                </p>
                <p>
                  如果你希望讨论氛围更稳定、表达更具体、信息密度更高，这里会比单纯追热点的内容广场更适合长期停留。
                </p>
                <div className="rounded-[18px] border border-dashed border-border bg-background p-4 text-foreground">
                  <div className="text-sm font-medium">一句话介绍</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {settings.siteName}，一个让兴趣被持续实践、整理和交流的地方。
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {highlights.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="shadow-xs">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-semibold">{item.title}</h2>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
          </AddonSurfaceRenderer>
          <AddonSlotRenderer slot="about.highlights.after" />

          <AddonSlotRenderer slot="about.principles.before" />
          <AddonSurfaceRenderer surface="about.principles" props={{ principles, settings }}>
            <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">我们的社区原则</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                页面不追求堆满信息，而是希望每一块都能准确传达社区气质。
              </p>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {principles.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="shadow-xs">
                    <CardContent className="p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
          </AddonSurfaceRenderer>
          <AddonSlotRenderer slot="about.principles.after" />

          <section className="space-y-4" id="协议">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">使用协议</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  继续注册、登录、浏览、发笺或互动，即视为接受以下条款。
                </p>
              </div>

              <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                <Card className="shadow-xs">
                  <CardContent className="p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-foreground">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">社区规则优先</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      协议用于明确风广场秩序、使用边界与处理原则，所有账户和内容活动都默认受其约束。
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-xs">
                  <CardContent className="p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-foreground">
                      <Scale className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">管理措施公开</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      禁言、拉黑、审核、下线、小黑屋展示等处理机制都属于社区治理的一部分。
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-xs">
                  <CardContent className="p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-foreground">
                      <Crown className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">继续使用即同意</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      若你继续注册、登录、浏览、发笺、评论或使用站内功能，即表示你接受当前协议及其后续更新。
                    </p>
                  </CardContent>
                </Card>
              </section>

              {[
                { id: "general", title: "一、协议适用范围", content: [`${settings.siteName} 是一个围绕兴趣讨论、内容沉淀与社区互动建立的社区系统。无论用户通过首页、分区、节点、搜索、邀请链接还是第三方分享链接进入，只要继续浏览、注册、登录、发笺、评论、点赞、收藏、上传、举报或使用其他功能，即视为已阅读并接受本协议。`, "本协议适用于全部公开页面、注册账户、站内互动、用户生成内容，以及后续新增但未单独立约的社区功能。若站点另有单独页面对某项能力作出补充说明，则该说明与本协议共同构成完整规则。"] },
                { id: "account", title: "二、账户注册与使用", content: ["站点可根据运营策略调整是否开放注册，也可能要求邀请码、邀请关系或其他前置条件。注册链接若自动带入邀请人或邀请码，系统可据此建立注册来源关系。", "用户应保证注册、登录与资料维护过程中提供的信息真实、可归属、可负责，不得冒用他人身份、伪造关系、批量注册、绕过限制或利用漏洞获取不当权益。", "账户仅限本人使用。若因共享账户、借用身份、泄露登录状态或其他个人保管不当导致损失、封禁、内容追责或权益异常，责任由账户实际控制人承担。"] },
                { id: "content", title: "三、内容发布与互动规范", content: ["用户发布的风笺、评论、回复、投票、附言、隐藏内容、图片与其他资料，均应符合基本法律法规、平台规则及公序良俗，不得发布违法、侵权、骚扰、侮辱、恶意引战、虚假欺诈、恶意营销或其他破坏社区秩序的内容。", "不同节点可独立配置浏览、发笺、回复权限，以及允许的风笺类型、发笺频率、审核要求、等级门槛、风铃门槛与 VIP 条件。用户进入某节点并尝试发笺或互动时，应主动遵守该节点实时生效的规则。", "站内的点赞、评论、举报、收藏、搜索、回复、采纳答案等功能，应当以正常交流和信息沉淀为目的，不得用于刷量、骚扰、恶意攻击、引战或规避审核。"] },
                { id: "moderation", title: "四、审核、下线与管理处置", content: ["平台有权根据内容安全规则、节点配置、举报结果或人工判断，对风笺、评论、用户资料与其他公开信息进行审核、延迟发布、隐藏、驳回、下线、限制传播或进一步处理。", "若账户或内容违反社区规范，平台可视情况采取提醒、拒绝发布、撤销展示、限制功能、禁言、拉黑、公开进入\u201C小黑屋\u201D等措施。上述措施可按行为严重程度、重复违规情况和社区影响综合判断。"] },
                { id: "privacy", title: "五、资料上传与隐私边界", content: ["用户上传头像、图片和其他素材时，应保证拥有相应权利或合法使用基础，不得上传违法、侵权、违规、恶意或可能危害平台运行安全的文件。", "平台会在账号系统、内容展示、审核管理、风控识别和功能实现所必需的范围内处理站内数据。对于昵称、头像、公开资料、发笺记录、互动行为与状态信息，用户应知晓这些内容可能在前台公开展示。"] },
                { id: "rights", title: "六、平台权利与责任边界", content: ["平台会尽力维持社区正常运行，但不对任何特定内容、互动结果、搜索可见性、成长效率、历史记录永久保留、第三方访问稳定性或特定功能持续开放作出绝对承诺。", "出于维护秩序、系统升级、安全修复、数据迁移、策略调整或其他合理运营目的，平台可中断、暂停、限制、下线或修改部分功能与页面，并在必要时更新相关规则内容。"] },
              ].map((section) => (
                <Card key={section.id} id={section.id} className="shadow-xs">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-foreground">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold tracking-tight">{section.title}</h3>
                        <ul className="mt-4 space-y-2.5 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                          {section.content.map((paragraph) => (
                            <li key={paragraph} className="flex gap-2">
                              <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/45" />
                              <span>{paragraph}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
            </>
          </AddonSurfaceRenderer>
          <AddonSlotRenderer slot="about.page.after" />

    
              </div>
            </main>
          )}
          rightSidebar={(
            <aside className="mt-6 hidden pb-12 lg:block">
              <AddonSlotRenderer slot="about.sidebar.before" />
              <AddonSurfaceRenderer surface="about.sidebar" props={{ announcements, hotTopics, settings }}>
                <HomeSidebarPanels user={null} currentUserSettings={buildHomeSidebarCurrentUserSettings(settings)} hotTopics={hotTopics} announcements={announcements}
                  showAnnouncements={settings.homeSidebarAnnouncementsEnabled} siteName={settings.siteName} siteDescription={settings.siteDescription} siteLogoPath={settings.siteLogoPath} siteIconPath={settings.siteIconPath} />
              </AddonSurfaceRenderer>
              <AddonSlotRenderer slot="about.sidebar.after" />
            </aside>
          )}
        />
      </div>
    </div>
  )
}
