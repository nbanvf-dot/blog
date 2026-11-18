import Image from "next/image";
import { Mail, Rss } from "lucide-react";
import { siteConfig } from "@/lib/site";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0.5C5.648 0.5 0.5 5.648 0.5 12c0 5.084 3.292 9.395 7.86 10.916.575.107.785-.25.785-.555 0-.274-.01-1-.015-1.962-3.197.695-3.872-1.541-3.872-1.541-.523-1.328-1.277-1.681-1.277-1.681-1.044-.714.079-.699.079-.699 1.155.081 1.763 1.186 1.763 1.186 1.026 1.759 2.692 1.251 3.349.956.104-.743.401-1.251.73-1.538-2.552-.29-5.236-1.276-5.236-5.68 0-1.255.448-2.281 1.184-3.085-.119-.29-.513-1.46.112-3.044 0 0 .965-.309 3.162 1.179a10.98 10.98 0 0 1 2.878-.387c.976.005 1.96.132 2.878.387 2.195-1.488 3.159-1.179 3.159-1.179.627 1.584.233 2.754.114 3.044.738.804 1.183 1.83 1.183 3.085 0 4.415-2.689 5.387-5.25 5.671.413.356.78 1.057.78 2.131 0 1.538-.014 2.779-.014 3.157 0 .308.207.667.791.554C20.211 21.391 23.5 17.082 23.5 12 23.5 5.648 18.352 0.5 12 0.5Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-zinc-200/80 pb-10 pt-8 sm:pb-12 sm:pt-12 dark:border-zinc-800/80"
    >
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 sm:h-20 sm:w-20 dark:border-zinc-800 dark:bg-zinc-900">
            <Image
              src={siteConfig.avatar}
              alt={`${siteConfig.name} (${siteConfig.handle}) 头像`}
              width={80}
              height={80}
              priority
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1
                id="hero-heading"
                className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50"
              >
                {siteConfig.name}
              </h1>
              <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
                @{siteConfig.handle}
              </span>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
              {siteConfig.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <a
          id="hero-github-link"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="访问 GitHub 主页"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <GitHubIcon className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </a>

        <a
          id="hero-x-link"
          href={siteConfig.links.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="访问 X (@haozigc)"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <XIcon className="h-3.5 w-3.5" />
          <span>@haozigc</span>
        </a>

        <a
          id="hero-email-link"
          href={siteConfig.links.email}
          aria-label="发送邮件给博主"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>Email</span>
        </a>

        <a
          id="hero-rss-link"
          href={siteConfig.links.rss}
          aria-label="订阅 RSS Feed"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <Rss className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>RSS</span>
        </a>
      </div>
    </section>
  );
}
