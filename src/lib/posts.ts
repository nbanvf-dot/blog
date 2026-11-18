import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  cover?: string;
  readingTime: string;
  readingMinutes: number;
  wordCount: number;
}

export interface PostDetail extends PostMeta {
  content: string;
  toc: TocItem[];
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/**
 * 按中英文混合字数估算阅读时长：
 * - 中文字符按 300 字/分钟估算
 * - 英文单词与代码标识符按 200 词/分钟估算
 */
export function estimateReadingTime(rawContent: string): {
  minutes: number;
  text: string;
  wordCount: number;
} {
  const cleaned = rawContent
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  const cjkMatches = cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  const nonCjk = cleaned.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, " ");
  const latinMatches = nonCjk.match(/[A-Za-z0-9_'-]+/g);
  const latinCount = latinMatches ? latinMatches.length : 0;

  const totalUnits = cjkCount + latinCount;
  const rawMinutes = cjkCount / 300 + latinCount / 200;
  const minutes = Math.max(1, Math.ceil(rawMinutes));

  return {
    minutes,
    text: `${minutes} 分钟阅读`,
    wordCount: totalUnits,
  };
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * 自动从 MDX 正文提取 h2 / h3 目录（跳过代码块内部注释）
 * 使用与 rehype-slug 相同的 github-slugger 生成锚点 id
 */
export function extractToc(rawContent: string): TocItem[] {
  const slugger = new GithubSlugger();
  const lines = rawContent.split(/\r?\n/);
  const toc: TocItem[] = [];
  let inCodeFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(```|~~~)/.test(trimmed)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(trimmed);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const rawHeading = match[2].replace(/\s+#+\s*$/, "");
    const cleanText = stripInlineMarkdown(rawHeading);
    if (!cleanText) continue;

    const id = slugger.slug(cleanText);
    toc.push({ id, text: cleanText, level });
  }

  return toc;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parsePostFile(filename: string): PostDetail {
  const slug = filename.replace(/\.mdx$/, "");
  const fullPath = path.join(POSTS_DIR, filename);
  const rawFile = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(rawFile);

  const stats = estimateReadingTime(content);
  const toc = extractToc(content);

  const tags = Array.isArray(data.tags)
    ? data.tags.map((t) => String(t))
    : [];

  return {
    slug,
    title: String(data.title || slug),
    date: formatDate(String(data.date || "2026-01-01")),
    tags,
    summary: String(data.summary || ""),
    cover: data.cover ? String(data.cover) : undefined,
    readingTime: stats.text,
    readingMinutes: stats.minutes,
    wordCount: stats.wordCount,
    content,
    toc,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const { content: _content, toc: _toc, ...meta } = parsePostFile(file);
    void _content;
    void _toc;
    return meta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): PostDetail | null {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  return parsePostFile(`${slug}.mdx`);
}

export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const posts = getAllPosts(); // newest first
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { prev: null, next: null };
  }

  // 按时间维度：上一篇（更早发布的文章）为 index + 1，下一篇（更新发布的文章）为 index - 1
  const prev = index < posts.length - 1 ? posts[index + 1] : null;
  const next = index > 0 ? posts[index - 1] : null;
  return { prev, next };
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}
