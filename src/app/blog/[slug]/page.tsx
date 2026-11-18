import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { ArrowLeft } from "lucide-react";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
} from "@/lib/posts";
import { CodeBlock } from "@/components/CodeBlock";
import { TableOfContents } from "@/components/TableOfContents";
import { PrevNextNav } from "@/components/PrevNextNav";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);

  const { content } = await compileMDX({
    source: post.content,
    components: {
      pre: CodeBlock,
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: {
                light: "github-light-default",
                dark: "github-dark-default",
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });

  return (
    <div className="pt-8 sm:pt-12">
      <div className="mb-8">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>返回文章列表</span>
        </Link>
      </div>

      <div className="lg:flex lg:items-start lg:gap-12">
        <article className="min-w-0 flex-1">
          <header className="border-b border-zinc-200/80 pb-7 dark:border-zinc-800/80">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              <time dateTime={post.date}>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
              <span aria-hidden="true">·</span>
              <span>约 {post.wordCount} 字</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
              {post.title}
            </h1>

            {post.summary && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
                {post.summary}
              </p>
            )}

            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded border border-zinc-200 bg-zinc-100/80 px-2 py-0.5 font-mono text-[11px] text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-zinc prose-editorial mt-8 max-w-none dark:prose-invert prose-headings:font-semibold prose-a:font-medium prose-a:underline prose-a:decoration-zinc-400 prose-a:underline-offset-4 hover:prose-a:decoration-zinc-900 dark:hover:prose-a:decoration-zinc-200">
            {content}
          </div>

          <PrevNextNav prev={prev} next={next} />
        </article>

        <TableOfContents items={post.toc} />
      </div>
    </div>
  );
}
