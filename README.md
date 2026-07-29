<div align="center">

# 风起时

**基于 Next.js 16 + React 19 + Prisma + PostgreSQL 的温柔心理社区**

一个适合心灵陪伴、情绪记录、温和交流的社区平台。  
源于 [Rhex](https://github.com/lovedevpanda/Rhex) 社区底座，深度定制品牌体验与心情功能。

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

---

## 项目简介

「风起时」是一个以温和陪伴为核心的心理社区平台。基于 Rhex 社区底座定制，围绕「风」的品牌意象重新设计了积分（风铃）、帖子（风笺）、社区（风广场）等核心概念，并新增心情记录与情绪追踪功能。

原始项目 Rhex 是一套面向正式部署和长期维护的论坛/社区底座，基于 Next.js App Router、React 19、Prisma、PostgreSQL 和 Redis 构建。

### 定制特性

- **品牌换名**：积分 → 风铃、帖子 → 风笺、论坛 → 风广场、VIP → 风铃居
- **心情页面**：独立心情首页，7 天情绪评分 + 每日心情记录
- **风起笺**：默认公共讨论节点，取代默认的「综合讨论」
- **金色叶子 Logo**：符合心理社区调性的温暖视觉标识

## 核心能力

### 心情与情绪

- 每日心情记录（😄😊😐😔😞 五档）
- 7 天心情趋势评分
- 帖子中也支持附上心情
- 每日限记一次

### 论坛与内容

- 分区、节点、标签、关注、热门流、最新流、搜索
- 普通帖、悬赏帖、投票帖、抽奖帖
- 匿名发帖、匿名回复、匿名马甲配置
- 楼层回复、楼中楼、点赞、收藏、关注、举报、屏蔽
- `@用户` 提及通知
- 红包帖、聚宝盆、打赏、礼物、热度权重
- 帖子可见等级/风铃限制、登录解锁、回复解锁、积分购买解锁
- 附件上传、附件购买、附件回复解锁、外链附件
- RSS 输出

### Markdown 与富内容

- Markdown 渲染
- 代码高亮
- KaTeX 数学公式
- Mermaid 图表
- Task List、脚注、上下标、定义列表、缩写等扩展
- 图片灯箱与媒体内容展示
- Markdown 自定义表情

### 用户体系

- 用户名密码登录
- GitHub OAuth、Google OAuth
- Passkey / WebAuthn
- 找回密码、邮箱/手机验证码
- 等级、勋章、认证、风铃居（VIP）
- 风铃（积分）、签到、补签、邀请奖励
- 邀请码、兑换码
- 个人资料、头像裁剪、账户绑定
- 站外通知 Webhook

### 后台管理

- 总览仪表盘
- 用户管理
- 风笺管理（帖子）
- 评论管理
- 分区/节点管理
- 节点申请审核
- 等级系统
- 勋章系统
- 认证系统
- 公告与帮助文档
- 举报中心
- 日志中心
- 敏感词与内容安全
- 站点设置
- 后台全局搜索

### 内置应用

| 应用 | 说明 |
|------|------|
| `AI 助手` | 配置 AI 开关、模型接口、提示词、代理账号，并在帖子/评论中被 `@` 后自动异步回复 |
| `RSS 抓取中心` | 支持 RSS/Atom 源管理、统一 worker 调度、Redis 队列快照、失败重试、日志追踪 |
| `五子棋` | 人机对战、免费次数、门票积分、AI 难度、胜利奖励 |
| `阴阳契` | 双选项积分挑战、税率配置、战绩统计 |
| `自助广告位` | 首页广告位购买、订单审核、广告展示 |

## 界面预览

<details>
<summary><b>心情首页</b></summary>

> 截图待补充 — 包含 7 天心情评分卡片 + 每日心情记录器

</details>

<details>
<summary><b>首页与社区导航</b></summary>

![首页预览](./docs/preview/home-overview.png)

</details>

<details>
<summary><b>帖子详情</b></summary>

![帖子详情](./docs/preview/post-detail.png)

</details>

<details>
<summary><b>后台管理</b></summary>

![后台总览](./docs/preview/admin-dashboard.png)

</details>

<details>
<summary><b>站点设置</b></summary>

![后台设置](./docs/preview/admin-settings.png)

</details>

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 16.2 + React 19 |
| UI / 样式 | Tailwind CSS 4.2、Base UI、Radix UI |
| 数据库 | PostgreSQL |
| ORM | Prisma |
| 缓存 / 队列 / 锁 | Redis + ioredis |
| 鉴权 | Session Cookie、GitHub OAuth、Google OAuth、Passkey |
| 内容渲染 | markdown-it、highlight.js、KaTeX、Mermaid |
| 文件处理 | 本地存储、S3/OSS 兼容对象存储、Jimp |
| 运行环境 | Node.js 20+ |

## 运行架构

标准部署至少包含 4 个部分：

- `Web / API`：Next.js 服务
- `PostgreSQL`：主数据库
- `Redis`：异步任务、消费锁、运行时队列
- `Worker`：统一后台进程，负责异步任务和 RSS 抓取

如果你使用本地上传，还需要为 `uploads/` 准备持久化存储。

## 环境变量

```bash
cp .env.example .env
```

必填：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bbs?schema=public"
SESSION_SECRET="replace-with-a-long-random-secret"
CAPTCHA_SECRET_KEY="replace-with-a-long-random-secret"
REDIS_URL="redis://127.0.0.1:6379"
```

如果 Redis 有密码或需要使用非 0 分库，可以二选一配置：

```env
# 推荐：直接写进连接串
REDIS_URL="redis://:your-password@127.0.0.1:6379/2"

# 或者保持 REDIS_URL 不含认证信息，额外设置：
REDIS_PASSWORD="your-password"
REDIS_DB="2"
```

多程序共用同一个 Redis 时，建议设置不同的 `REDIS_KEY_PREFIX`；如果使用 Docker Compose 内置 Redis，`REDIS_PASSWORD` 也会自动启用 Redis `requirepass`。建议同时设置 `SITE_URL` / `APP_URL`。其他配置按需修改 `.env.example` 里的注释即可。

## Docker Compose 部署

前置条件：Docker Engine / Docker Desktop、Docker Compose Plugin。

### 首次安装

```bash
git clone <your-repo-url>
cd rhex-community
cp .env.example .env
```

改完 `.env` 后启动：

```bash
docker compose up -d
```

完成后访问 `http://localhost:3000`。

### 升级

```bash
docker compose pull
docker compose up -d --remove-orphans
```

备份：

```bash
docker compose --profile backup run --rm postgres-backup
tar -czf backups/rhex-files-$(date +%Y%m%d-%H%M%S).tar.gz uploads addons .env docker-compose.yml
```

## 本地开发

前置条件：Node.js 20+、PostgreSQL 16+、Redis 6+、pnpm。

### 启动服务

**1. 启动 PostgreSQL 和 Redis**

```bash
docker compose -f docker-compose.dev.yml up -d
```

**2. 安装依赖**

```bash
pnpm install
```

**3. 初始化数据库**

```bash
pnpm run setup
```

**4. 启动开发服务器**

```bash
pnpm run dev
```

开发服务器默认运行在 `http://localhost:3456`。  
局域网其他设备访问请使用 `http://<本机IP>:3456`，如遇加载问题可尝试去掉 `--turbopack` 并确保 `next.config.mjs` 中包含 `allowedDevOrigins: ['*']`。

**5. 启动 Worker**（处理后台任务、RSS 抓取等）

```bash
pnpm run worker
```

### 默认管理账号

- 用户名：`admin`
- 密码：`ChangeMe_123456`

首次登录后请立即修改密码。

### 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm run dev` | 启动开发环境（默认端口 3456） |
| `pnpm run build` | 构建生产包 |
| `pnpm run start` | 启动生产 Web 服务 |
| `pnpm run start:prod` | 构建并启动生产 Web 服务 |
| `pnpm run setup` | 同步数据库结构并按需写入基础数据 |
| `pnpm run setup:prod` | 以 `NODE_ENV=production` 执行 `pnpm run setup` |
| `pnpm run worker` | 启动统一 worker，处理异步任务 |
| `pnpm run prisma:generate` | 生成 Prisma Client |
| `pnpm run prisma:push` | 同步数据库结构 |
| `pnpm run prisma:seed` | 执行种子脚本 |
| `pnpm run lint` | 运行 ESLint |
| `pnpm run typecheck` | 运行 TypeScript 类型检查 |

## 后台模块概览

### 管理后台

- `/admin`
- `/admin?tab=users`
- `/admin?tab=posts`
- `/admin?tab=comments`
- `/admin?tab=structure`
- `/admin?tab=levels`
- `/admin?tab=badges`
- `/admin?tab=verifications`
- `/admin?tab=announcements`
- `/admin?tab=reports`
- `/admin?tab=logs`
- `/admin?tab=security`

### 站点设置

- 展示与品牌
- 注册与邀请
- 验证码
- GitHub / Google / Passkey
- SMTP
- 节点申请
- 评论与互动
- 匿名发帖
- 打赏与礼物
- 红包与聚宝盆
- 热度算法
- 风铃（积分）与风铃居（VIP）
- 上传与附件
- Markdown 表情
- 页脚导航
- 头部应用导航

### 应用后台

- `/admin/apps/ai-reply`
- `/admin/apps/rss-harvest`
- `/admin/apps/gobang`
- `/admin/apps/yinyang-contract`
- `/admin/apps/self-serve-ads`

## 项目结构

```text
rhex-community/
├── src/
│   ├── app/              # 页面、路由、API Route（含心情首页 mood page）
│   ├── components/       # UI 组件和页面组件
│   ├── db/               # Prisma 查询与数据访问层
│   ├── hooks/            # 前端复用 Hook
│   ├── lib/              # 业务服务、运行时、领域逻辑
│   └── types/            # TS 类型声明
├── prisma/
│   ├── migrations/       # 数据库迁移
│   ├── schema.prisma     # Prisma 数据模型（含 MoodRecord 模型）
│   └── seed.ts           # 初始化种子脚本
├── public/
│   └── icon.svg          # 风起时品牌 Logo（金色叶子）
├── scripts/              # setup、worker 等脚本
├── uploads/              # 本地上传目录
├── docs/                 # 项目文档和截图
├── docker-compose.yml    # 生产部署
├── docker-compose.dev.yml # 本地开发（PostgreSQL + Redis）
├── .env.example
├── package.json
└── README.md
```

## 心情功能说明

### 心情记录

- 每日可记录一次心情，五档可选：😄 很开心、😊 开心、😐 一般、😔 低落、😞 很失落
- 发帖时也可以在编辑器中附上心情标签
- 心情数据聚合展示在独立的心情首页（`/`）

### 心情首页

- 7 天心情评分卡片，展示过去 7 天的心情平均值
- 每日心情记录器，方便快捷记录当天情绪

### 数据模型

心情数据来自两个来源：
- **MoodRecord**：独立的心情记录表，每天每次只能记录一条心情
- **Post.mood**：帖子中附带的心情字段

两者共同计入 7 天心情评分。

## 定制品牌名称映射

| 原名称 | 定制名称 |
|--------|----------|
| 积分 | 风铃 |
| 帖子 | 风笺 |
| 论坛 | 风广场 |
| 综合讨论 | 风起笺 |
| VIP | 风铃居 |
| 站点名称 | 风起时 |

## 适用场景

- 心理陪伴与情绪记录社区
- 温和交流的匿名/半匿名社区
- 兴趣社区
- 知识论坛
- 内容沉淀型社区
- 品牌会员社区
- 内部讨论平台

## License

本项目基于 [MIT License](./LICENSE) 开源。
