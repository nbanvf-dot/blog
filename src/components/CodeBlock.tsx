"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = React.ComponentPropsWithoutRef<"pre"> & {
  "data-language"?: string;
};

export function CodeBlock({
  children,
  className = "",
  ...props
}: CodeBlockProps) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const language = props["data-language"] || "text";

  const handleCopy = async () => {
    const rawCode = preRef.current?.textContent ?? "";
    if (!rawCode) return;
    try {
      await navigator.clipboard.writeText(rawCode.trimEnd());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored if denied
    }
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-zinc-200/90 bg-zinc-50 dark:border-zinc-800/90 dark:bg-zinc-900/80">
      <div className="flex items-center justify-between border-b border-zinc-200/80 bg-zinc-100/75 px-4 py-2 dark:border-zinc-800/80 dark:bg-zinc-900">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="复制代码"
          className="inline-flex items-center gap-1.5 rounded border border-zinc-200/90 bg-white px-2 py-1 font-mono text-[11px] text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-700/80 dark:bg-zinc-800/90 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      <pre
        ref={preRef}
        className={`overflow-x-auto py-4 font-mono text-[13px] leading-relaxed ${className}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
