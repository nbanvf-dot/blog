import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于与作品",
  description: `关于 ${siteConfig.name} (${siteConfig.handle}) 的个人经历与开源项目集。`,
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pt-8 sm:pt-12">
      {/* 个人介绍 */}
      <section aria-labelledby="about-heading" className="space-y-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            <Image
              src={siteConfig.avatar}
              alt={`${siteConfig.name} 头像`}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1
              id="about-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50"
            >
              关于 {siteConfig.name}
            </h1>
            <p className="mt-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              @{siteConfig.handle} · {siteConfig.description}
            </p>
          </div>
        </div>

        <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-base dark:text-zinc-300">
          <p>
            你好，我是<strong>财浩（nbanvf）</strong>
            。一名热衷于系统底层逻辑与极简工程美学的全栈开发者与独立创作者。
          </p>
          <p>
            日常关注 Linux
            基础设施自动化、边缘网络架构、现代全栈 Web
            工程（TypeScript / Go / Python）以及如何在喧嚣的信息流时代构建可持续的个人工作流与数字生活秩序。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
          >
            <span>github.com/nbanvf-dot</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={siteConfig.links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
          >
            <span>x.com/haozigc</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={siteConfig.links.email}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{siteConfig.author.email}</span>
          </a>
        </div>
      </section>

      {/* 开源项目与作品 */}
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="scroll-mt-20 border-t border-zinc-200/80 pt-12 dark:border-zinc-800/80"
      >
        <div className="mb-6">
          <h2
            id="projects-heading"
            className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            开源项目与作品
          </h2>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            在 GitHub 持续维护的实验工具、边缘服务脚本与长期写作仓库。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {siteConfig.projects.map((project) => (
            <a
              key={project.name}
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-zinc-200/85 bg-white p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800/90 dark:bg-zinc-900/50 dark:hover:border-zinc-600"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                      {project.name}
                    </span>
                    <span className="ml-2 rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      {project.category}
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-950 dark:group-hover:text-zinc-50" />
                </div>

                <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 个人经历时间线 */}
      <section
        aria-labelledby="timeline-heading"
        className="border-t border-zinc-200/80 pt-12 dark:border-zinc-800/80"
      >
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2
              id="timeline-heading"
              className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
              经历时间线
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              关键阶段记录（示例时间线，可在{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-900">
                src/lib/site.ts
              </code>{" "}
              中按需自定义）。
            </p>
          </div>
        </div>

        <ol className="relative ml-2 border-l border-zinc-200 dark:border-zinc-800">
          {siteConfig.timeline.map((item, idx) => (
            <li key={idx} className="mb-9 ml-6 last:mb-0">
              <span
                className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border border-zinc-400 bg-zinc-50 dark:border-zinc-500 dark:bg-zinc-950"
                aria-hidden="true"
              />
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {item.period}
              </span>
              <h3 className="mt-1 text-base font-semibold text-zinc-950 dark:text-zinc-100">
                {item.role}
              </h3>
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {item.organization}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
