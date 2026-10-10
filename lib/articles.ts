import fs from "node:fs";
import path from "node:path";

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  coverImage?: string;
  tags: string[];
  body: string;
  readingTime: string;
};

const articlesDirectory = path.join(process.cwd(), "articles");

function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { metadata: {}, body: markdown };
  }

  const metadata: Record<string, string | string[]> = {};
  const lines = match[1].split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const listMatch = line.match(/^([A-Za-z0-9_-]+):\s*$/);

    if (listMatch) {
      const key = listMatch[1];
      const values: string[] = [];

      while (lines[index + 1]?.startsWith("  - ")) {
        index += 1;
        values.push(lines[index].replace(/^  - /, "").trim());
      }

      metadata[key] = values;
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (keyValueMatch) {
      const [, key, rawValue] = keyValueMatch;
      metadata[key] = rawValue.trim().replace(/^"|"$/g, "");
    }
  }

  return {
    metadata,
    body: markdown.slice(match[0].length),
  };
}

function getReadingTime(body: string) {
  const words = body
    .replace(/```[\s\S]*?```/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function readArticle(fileName: string): Article {
  const filePath = path.join(articlesDirectory, fileName);
  const markdown = fs.readFileSync(filePath, "utf8");
  const { metadata, body } = parseFrontmatter(markdown);
  const fallbackSlug = fileName.replace(/\.md$/, "");

  return {
    slug: String(metadata.slug ?? fallbackSlug),
    title: String(metadata.title ?? fallbackSlug),
    description: String(metadata.description ?? ""),
    date: String(metadata.date ?? ""),
    updatedAt:
      typeof metadata.updatedAt === "string" ? metadata.updatedAt : undefined,
    coverImage:
      typeof metadata.coverImage === "string" ? metadata.coverImage : undefined,
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    body,
    readingTime: getReadingTime(body),
  };
}

export function getAllArticles() {
  if (!fs.existsSync(articlesDirectory)) return [];

  return fs
    .readdirSync(articlesDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readArticle)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticleBySlug(slug: string) {
  return getAllArticles().find((article) => article.slug === slug);
}
