import * as React from "react";
import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { BlogCatalog } from "@/components/TagFilter";

export const metadata: Metadata = {
  title: "文章",
  description: "技术折腾手记、边缘网络基础设施实践与独立创作思考归档。",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="pt-8 sm:pt-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
          文章归档
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          共 {posts.length} 篇文章，支持按标签筛选与实时关键词检索。
        </p>
      </header>

      <React.Suspense
        fallback={
          <div className="py-10 font-mono text-xs text-zinc-400">
            正在加载文章列表...
          </div>
        }
      >
        <BlogCatalog posts={posts} tags={tags} />
      </React.Suspense>
    </div>
  );
}
