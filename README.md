# 财浩 (nbanvf) 个人博客

一个基于 **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4** 构建的现代极简个人博客系统，采用本地 **MDX** 文件作为无数据库文章源，参考 Vercel / Linear 的黑白极简科技视觉风格。

## 核心特性

- **极简黑白科技美学**：支持暗黑 / 亮色 / 跟随系统模式切换（`next-themes`，`class` 策略），针对中英文混排深度调优行高与字距。
- **纯本地 MDX 数据源**：所有文章存放在 `content/posts/*.mdx`，无需配置任何外部数据库或 CMS，Git 即内容库。
- **双主题语法高亮与代码复制**：基于 `next-mdx-remote`（RSC `compileMDX` 架构）+ `rehype-pretty-code`（Shiki `github-light-default` / `github-dark-default` 双主题）渲染代码块，内置语言标识栏与一键复制按钮。
- **自动目录（TOC）与阅读时长**：自动提取正文中 `h2` / `h3` 标题生成桌面端右侧悬浮目录（含滚动高亮），并按中英文混合字数精准估算阅读时长。
- **前端实时检索与标签筛选**：`/blog` 页面支持按标签过滤及标题/摘要关键词实时搜索。
- **SEO 与订阅完备**：内置 `/rss.xml` RSS 2.0 订阅源与 `/sitemap.xml` 站点地图，全站移动端抽屉式响应式适配。

---

## 技术栈与依赖说明

| 模块 | 选用方案 | 说明 |
| :--- | :--- | :--- |
| 框架 | `next@15` + `react@19` + `typescript` | 使用 App Router 静态预渲染（SSG），构建产物极速响应 |
| 样式 | `tailwindcss@4` + `@tailwindcss/typography` | 采用 Tailwind v4 原生 CSS 配置（`src/app/globals.css`） |
| MDX 编译 | `next-mdx-remote` (`compileMDX` RSC) | 相比 `contentlayer2` 对 Next.js 15 + React 19 兼容性更原生稳定，零额外守护进程 |
| Markdown 增强 | `gray-matter` + `remark-gfm` + `rehype-slug` + `github-slugger` | 解析 Frontmatter、GFM 表格/任务列表及中英文标题锚点 |
| 代码高亮 | `rehype-pretty-code` + `shiki` | 编译期完成 Shiki 语法着色，运行时零 JS 高亮开销 |
| 主题与图标 | `next-themes` + `lucide-react` | 无闪烁暗黑模式切换与轻量矢量图标 |

---

## 本地运行与构建

确保本地已安装 **Node.js 20+** 与 `npm`：

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务器（默认 http://localhost:3000）
npm run dev

# 3. 执行生产环境静态构建验证
npm run build

# 4. 启动生产服务器预览
npm run start
```

> 如需设置正式部署域名（用于生成 RSS 与 Sitemap 中的绝对链接），可在根目录创建 `.env.local`：
> ```env
> NEXT_PUBLIC_SITE_URL=https://你的域名.com
> ```

---

## 自定义指南

### 1. 替换个人头像
直接将你自己的正方形头像图片命名为 `avatar.png`，覆盖替换以下文件即可生效：
- `public/avatar.png`（推荐尺寸 `256x256` 或 `512x512`，PNG / WebP / JPG 均可；如改后缀名，同步修改 `src/lib/site.ts` 中的 `avatar` 字段）。

### 2. 修改个人信息、开源项目与经历时间线
打开 `src/lib/site.ts`：
- 修改 `name`、`description`、`links` 即可更新全站博主信息与社交链接；
- 修改 `projects` 数组即可增删 `/about` 与首页展示的开源项目卡片；
- 修改 `timeline` 数组即可将示例个人经历时间线替换为你自己的真实履历。

### 3. 新增博客文章
在 `content/posts/` 目录下新建 `<slug>.mdx` 文件，顶部按如下格式填写 Frontmatter：

```mdx
---
title: "文章标题"
date: "2026-11-18"
tags:
  - "基础设施"
  - "TypeScript"
summary: "一段简短清晰的文章摘要，会展示在文章列表卡片、SEO 描述与 RSS 订阅源中。"
---

## 正文二级标题

在这里开始你的正文写作...
```
