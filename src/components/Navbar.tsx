"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { useActiveNav } from "@/lib/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileDrawer } from "@/components/MobileDrawer";

export function Navbar() {
  const { isItemActive, handleNavClick } = useActiveNav();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/70 bg-zinc-50/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5 sm:px-8">
        <Link
          id="navbar-brand-link"
          href="/"
          onClick={() => handleNavClick("/")}
          className="group inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-zinc-950 transition-opacity hover:opacity-80 dark:text-zinc-50"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded border border-zinc-900 bg-zinc-950 font-mono text-xs font-bold text-zinc-50 dark:border-zinc-200 dark:bg-zinc-100 dark:text-zinc-950">
            N
          </span>
          <span>{siteConfig.name}</span>
          <span className="hidden font-mono text-xs font-normal text-zinc-400 sm:inline dark:text-zinc-500">
            /{siteConfig.handle}
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
            {siteConfig.nav.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-zinc-200/75 font-medium text-zinc-950 dark:bg-zinc-800/90 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-zinc-200/40 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
