import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-zinc-200/80 py-10 dark:border-zinc-800/80">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-4 px-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:px-8 dark:text-zinc-400">
        <p className="font-mono">
          © {year} {siteConfig.name} ({siteConfig.handle}). Built with Next.js &
          MDX.
        </p>

        <div className="flex flex-wrap items-center gap-4 font-mono">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
          >
            X
          </a>
          <a
            href={siteConfig.links.email}
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
          >
            Email
          </a>
          <Link
            href="/rss.xml"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
          >
            RSS
          </Link>
          <Link
            href="/sitemap.xml"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
          >
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
