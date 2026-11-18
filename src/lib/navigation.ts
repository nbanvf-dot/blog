"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

interface NavigationLikeEventTarget {
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

export function useActiveNav() {
  const pathname = usePathname();
  const [hash, setHash] = React.useState("");

  const syncHash = React.useCallback(() => {
    if (typeof window !== "undefined") {
      setHash(window.location.hash);
    }
  }, []);

  React.useEffect(() => {
    syncHash();
  }, [pathname, syncHash]);

  React.useEffect(() => {
    syncHash();

    const onDocumentClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }
      try {
        const url = new URL(anchor.href, window.location.origin);
        if (url.origin === window.location.origin) {
          setHash(url.hash);
        }
      } catch {
        // Ignore malformed hrefs (e.g. mailto:)
      }
    };

    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    document.addEventListener("click", onDocumentClick, true);

    const nav = (
      window as unknown as { navigation?: NavigationLikeEventTarget }
    ).navigation;
    nav?.addEventListener("currententrychange", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
      document.removeEventListener("click", onDocumentClick, true);
      nav?.removeEventListener("currententrychange", syncHash);
    };
  }, [syncHash]);

  const isItemActive = React.useCallback(
    (href: string): boolean => {
      if (href === "/") {
        return pathname === "/";
      }
      if (href === "/blog") {
        return pathname === "/blog" || pathname.startsWith("/blog/");
      }

      const [targetPath, targetHashRaw] = href.split("#");
      const targetHash = targetHashRaw ? `#${targetHashRaw}` : "";

      if (pathname !== targetPath) {
        return false;
      }

      if (targetHash) {
        return hash === targetHash;
      }

      const siblingHashes = siteConfig.nav
        .filter(
          (item) => item.href !== href && item.href.startsWith(`${targetPath}#`)
        )
        .map((item) => `#${item.href.split("#")[1]}`);

      return !siblingHashes.includes(hash);
    },
    [pathname, hash]
  );

  const handleNavClick = React.useCallback(
    (href: string) => {
      const [targetPath, targetHashRaw] = href.split("#");
      const targetHash = targetHashRaw ? `#${targetHashRaw}` : "";
      setHash(targetHash);

      if (typeof window !== "undefined" && pathname === targetPath) {
        if (!targetHash) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        } else {
          requestAnimationFrame(() => {
            const el = document.getElementById(targetHashRaw);
            el?.scrollIntoView({ behavior: "smooth" });
          });
        }
      }
    },
    [pathname]
  );

  return { pathname, hash, syncHash, isItemActive, handleNavClick };
}
