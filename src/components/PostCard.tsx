import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative rounded-xl border border-transparent px-4 py-5 -mx-4 transition-colors hover:border-zinc-200/80 hover:bg-white dark:hover:border-zinc-800/90 dark:hover:bg-zinc-900/60">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        <time dateTime={post.date}>{post.date}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime}</span>
      </div>

      <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950 transition-colors group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-white">
        <Link href={`/blog/${post.slug}`} className="focus:outline-none">
          <span className="absolute inset-0 rounded-xl" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5">
            <span>{post.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-70" />
          </span>
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {post.summary}
      </p>

      {post.tags.length > 0 && (
        <div className="relative z-10 mt-3.5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded border border-zinc-200/90 bg-zinc-100/80 px-2 py-0.5 font-mono text-[11px] text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
