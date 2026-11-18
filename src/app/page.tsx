import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { Hero } from "@/components/Hero";
import { PostCard } from "@/components/PostCard";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);
  const featuredProjects = siteConfig.projects.slice(0, 4);

  return (
    <div className="space-y-14">
      <Hero />

      <section aria-labelledby="latest-posts-heading">
        <div className="mb-6 flex items-baseline justify-between">
          <h2
            id="latest-posts-heading"
            className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            最新文章
          </h2>
          <Link
            id="home-all-posts-link"
            href="/blog"
            className="group inline-flex items-center gap-1 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <span>全部文章</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
          {posts.map((post) => (
            <div key={post.slug} className="py-2 first:pt-0">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="featured-projects-heading"
        className="border-t border-zinc-200/80 pt-12 dark:border-zinc-800/80"
      >
        <div className="mb-6 flex items-baseline justify-between">
          <h2
            id="featured-projects-heading"
            className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            精选开源项目
          </h2>
          <Link
            id="home-all-projects-link"
            href="/about#projects"
            className="group inline-flex items-center gap-1 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <span>查看全部</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <a
              key={project.name}
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800/90 dark:bg-zinc-900/50 dark:hover:border-zinc-600"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                    {project.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {project.tech.map((item) => (
                  <span
                    key={item}
                    className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
