"use client";

import * as React from "react";
import type { TocItem } from "@/lib/posts";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id ?? "");

  React.useEffect(() => {
    if (items.length === 0) return;

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -68% 0px",
        threshold: [0, 1],
      }
    );

    for (const el of headingElements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside
      aria-label="文章目录"
      className="hidden lg:block lg:w-56 lg:shrink-0"
    >
      <div className="sticky top-24 border-l border-zinc-200/80 pl-4 dark:border-zinc-800/80">
        <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          On this page
        </p>
        <ul className="space-y-2 text-xs leading-snug">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                className={item.level === 3 ? "pl-3" : ""}
              >
                <a
                  href={`#${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  className={`block transition-colors ${
                    isActive
                      ? "font-medium text-zinc-950 dark:text-zinc-50"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
