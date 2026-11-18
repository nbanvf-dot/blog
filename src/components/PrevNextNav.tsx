import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/posts";

export function PrevNextNav({
  prev,
  next,
}: {
  prev: PostMeta | null;
  next: PostMeta | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="上下篇文章导航"
      className="mt-14 grid gap-4 border-t border-zinc-200/80 pt-8 sm:grid-cols-2 dark:border-zinc-800/80"
    >
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800/90 dark:bg-zinc-900/50 dark:hover:border-zinc-600"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>上一篇</span>
          </span>
          <span className="mt-2 line-clamp-2 text-sm font-medium text-zinc-900 group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-white">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-right transition-colors hover:border-zinc-400 dark:border-zinc-800/90 dark:bg-zinc-900/50 dark:hover:border-zinc-600"
        >
          <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            <span>下一篇</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 line-clamp-2 text-sm font-medium text-zinc-900 group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-white">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}
