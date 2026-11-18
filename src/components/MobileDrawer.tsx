"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function MobileDrawer() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mql = window.matchMedia("(min-width: 768px)");
    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    mql.addEventListener("change", onMediaChange);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      mql.removeEventListener("change", onMediaChange);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        id="mobile-menu-open-button"
        type="button"
        aria-label="打开导航菜单"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200/80 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <Menu className="h-4 w-4" strokeWidth={1.75} />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-xs transition-opacity md:hidden"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="移动端导航抽屉"
          >
            <div
              className="flex h-full w-72 max-w-[82vw] flex-col justify-between overflow-y-auto overscroll-contain border-l border-zinc-200 bg-zinc-50 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
              onClick={(e) => e.stopPropagation()}
            >
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
                >
                  {siteConfig.handle}
                  <span className="text-zinc-400 dark:text-zinc-500">.dev</span>
                </Link>
                <button
                  id="mobile-menu-close-button"
                  type="button"
                  aria-label="关闭导航菜单"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>

              <nav className="mt-6 flex flex-col space-y-1" aria-label="移动端主导航">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === "/"
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950"
                      : "text-zinc-700 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  }`}
                >
                  首页
                </Link>
                {siteConfig.nav.map((item) => {
                  const isActive =
                    item.href === "/blog"
                      ? pathname.startsWith("/blog")
                      : pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950"
                          : "text-zinc-700 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-zinc-200/80 pt-5 dark:border-zinc-800/80">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Connect
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-md px-2 py-1.5 text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={siteConfig.links.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-md px-2 py-1.5 text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                >
                  <span>X (@haozigc)</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={siteConfig.links.email}
                  className="inline-flex items-center justify-between rounded-md px-2 py-1.5 text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                >
                  <span>{siteConfig.author.email}</span>
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
