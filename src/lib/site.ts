export interface ProjectItem {
  name: string;
  repoUrl: string;
  description: string;
  tech: string[];
  category: string;
}

export interface TimelineItem {
  period: string;
  role: string;
  organization: string;
  description: string;
}

export const siteConfig = {
  name: "财浩",
  handle: "nbanvf",
  title: "财浩 (nbanvf) — 全栈开发与独立创作",
  description: "全栈开发者 / 独立创作者，记录技术折腾与生活思考",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://blog.nbanvf.dev",
  avatar: "/avatar.png",
  author: {
    name: "财浩",
    handle: "nbanvf",
    bio: "全栈开发者 / 独立创作者，记录技术折腾与生活思考",
    email: "nbanvf@gmail.com",
  },
  links: {
    github: "https://github.com/nbanvf-dot",
    x: "https://x.com/haozigc",
    email: "mailto:nbanvf@gmail.com",
    rss: "/rss.xml",
  },
  nav: [
    { label: "文章", href: "/blog" },
    { label: "项目", href: "/about#projects" },
    { label: "关于", href: "/about" },
  ],
  /**
   * 开源项目与个人作品列表（真实 GitHub 仓库链接）
   * 如需增删项目，直接编辑此数组即可自动同步至 /about 页面。
   */
  projects: [
    {
      name: "nodectl",
      repoUrl: "https://github.com/nbanvf-dot/nodectl",
      description:
        "面向多地域轻量云与自建服务器的声明式节点巡检、SSH 批量编排与状态同步命令行工具。",
      tech: ["Go", "CLI", "SSH", "Systemd"],
      category: "Infrastructure",
    },
    {
      name: "netpilot",
      repoUrl: "https://github.com/nbanvf-dot/netpilot",
      description:
        "智能网络链路探测、策略路由分流与延迟抖动可视化面板，让复杂家庭与跨境实验网络保持清晰可控。",
      tech: ["TypeScript", "Linux Networking", "Web UI"],
      category: "Networking",
    },
    {
      name: "cf",
      repoUrl: "https://github.com/nbanvf-dot/cf",
      description:
        "围绕 Cloudflare DNS、边缘规则与证书生命周期打造的自动化脚本与高效率运维工具集。",
      tech: ["TypeScript", "Cloudflare API", "Automation"],
      category: "Edge",
    },
    {
      name: "cfw",
      repoUrl: "https://github.com/nbanvf-dot/cfw",
      description:
        "基于边缘计算运行时的超轻量级请求网关、反向代理与无服务器流量调度实践。",
      tech: ["Cloudflare Workers", "Edge Runtime", "HTTP"],
      category: "Edge",
    },
    {
      name: "wloc-spoofer",
      repoUrl: "https://github.com/nbanvf-dot/wloc-spoofer",
      description:
        "针对无线定位协议（WLOC）数据包结构的逆向研究、解析与位置隐私安全测试工具。",
      tech: ["Python", "Protobuf", "Security Research"],
      category: "Security",
    },
    {
      name: "HowToLiveBetter",
      repoUrl: "https://github.com/nbanvf-dot/HowToLiveBetter",
      description:
        "代码之外的长期工程：整理睡眠、精力分配、数字极简工作流与日常生活系统化的开源笔记。",
      tech: ["Markdown", "Life OS", "Writing"],
      category: "Essays",
    },
  ] satisfies ProjectItem[],

  /**
   * 个人经历时间线（示例占位内容，可在此处自由替换为你的真实履历与节点）
   */
  timeline: [
    {
      period: "2025 — 至今",
      role: "独立创作者 / 全栈开发者",
      organization: "Independent Lab (@nbanvf-dot)",
      description:
        "专注于边缘网络工具链、Linux 节点自动化运维与现代 Web 产品构建，持续维护 nodectl、netpilot 等开源项目。",
    },
    {
      period: "2023 — 2025",
      role: "高级全栈工程师",
      organization: "云原生与开发者工具方向（示例经历，可在 src/lib/site.ts 编辑）",
      description:
        "负责高并发 API 网关、自动化部署流水线以及使用 TypeScript + React 构建极简工程控制台。",
    },
    {
      period: "2020 — 2023",
      role: "后端与基础设施工程师",
      organization: "分布式系统研发（示例经历，可在 src/lib/site.ts 编辑）",
      description:
        "深入 Linux 网络栈、容器化编排与可观测性体系建设，养成用自动化脚本消灭重复手工运维的习惯。",
    },
    {
      period: "更早之前",
      role: "Hello, World!",
      organization: "折腾与探索的起点",
      description:
        "从第一台自建 Linux VPS 与静态博客开始，爱上亲手拆解协议、造小工具并把踩坑过程写成文档。",
    },
  ] satisfies TimelineItem[],
};
