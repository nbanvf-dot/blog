"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export interface TagFilterProps {
  tags: { tag: string; count: number }[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  totalCount: number;
}

export function TagFilter({
  tags,
  selectedTag,
  onSelectTag,
  totalCount,
}: TagFilterProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="按文章标签筛选"
    >
      <button
        id="tag-filter-all"
        type="button"
        onClick={() => onSelectTag(null)}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
          selectedTag === null
            ? "border-zinc-900 bg-zinc-950 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
        }`}
      >
        <span>全部</span>
        <span className="opacity-65">{totalCount}</span>
      </button>

      {tags.map(({ tag, count }) => {
        const active = selectedTag === tag;
        return (
          <button
            key={tag}
            id={`tag-filter-${tag}`}
            type="button"
            onClick={() => onSelectTag(active ? null : tag)}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
              active
                ? "border-zinc-900 bg-zinc-950 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            }`}
          >
            <span>#{tag}</span>
            <span className="opacity-65">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export function BlogCatalog({
  posts,
  tags,
}: {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialTag = searchParams.get("tag");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(
    initialTag
  );
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    setSelectedTag(searchParams.get("tag"));
  }, [searchParams]);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filteredPosts = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      if (!matchesTag) return false;
      if (!normalizedQuery) return true;
      return (
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.summary.toLowerCase().includes(normalizedQuery) ||
        post.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [posts, selectedTag, query]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            strokeWidth={1.75}
          />
          <input
            id="blog-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章标题或摘要关键词..."
            aria-label="搜索文章标题或摘要关键词"
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-9 text-sm text-zinc-950 placeholder:text-zinc-400 transition-colors focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
          />
          {query && (
            <button
              id="blog-search-clear"
              type="button"
              aria-label="清空搜索词"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={handleTagChange}
          totalCount={posts.length}
        />
      </div>

      <div className="border-t border-zinc-200/80 pt-4 dark:border-zinc-800/80">
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
            {filteredPosts.map((post) => (
              <div key={post.slug} className="py-2 first:pt-0">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 py-14 text-center dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              未找到匹配的文章，试试更换关键词或清除筛选条件。
            </p>
            <button
              id="blog-reset-filters"
              type="button"
              onClick={() => {
                setQuery("");
                handleTagChange(null);
              }}
              className="mt-4 inline-flex items-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              重置筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
