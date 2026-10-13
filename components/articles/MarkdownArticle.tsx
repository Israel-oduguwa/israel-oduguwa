import React from "react";
import { headingId } from "@/lib/markdown";

type Block =
  | { type: "heading"; depth: 1 | 2 | 3; text: string }
  | { type: "image"; alt: string; src: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string };

const imageLinePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;

function isSpecialLine(line: string) {
  return (
    line.startsWith("# ") ||
    line.startsWith("## ") ||
    line.startsWith("### ") ||
    line.startsWith("> ") ||
    line.startsWith("- ") ||
    imageLinePattern.test(line) ||
    line.startsWith("```")
  );
}

function parseBlocks(markdown: string) {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.replace("```", "").trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({
        type: "code",
        language: language || "text",
        code: codeLines.join("\n"),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "heading", depth: 3, text: line.slice(4) });
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", depth: 2, text: line.slice(3) });
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push({ type: "heading", depth: 1, text: line.slice(2) });
      index += 1;
      continue;
    }

    const imageMatch = line.match(imageLinePattern);

    if (imageMatch) {
      blocks.push({
        type: "image",
        alt: imageMatch[1],
        src: imageMatch[2],
      });
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].startsWith("> ")) {
        quoteLines.push(lines[index].slice(2));
        index += 1;
      }

      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2));
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines: string[] = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !isSpecialLine(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function renderInline(text: string) {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      nodes.push(
        <strong
          key={match.index}
          className="font-semibold text-slate-950 dark:text-white"
        >
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em
          key={match.index}
          className="font-medium text-slate-800 dark:text-slate-200"
        >
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={match.index}
          className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.86em] text-slate-900 dark:border-white/10 dark:bg-white/10 dark:text-sky-100"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

      if (linkMatch) {
        nodes.push(
          <a
            key={match.index}
            href={
              /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(linkMatch[2])
                ? linkMatch[2]
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline decoration-primary/25 underline-offset-4 transition hover:decoration-primary"
          >
            {linkMatch[1]}
          </a>,
        );
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const lines = code.split("\n");
  const label = language === "txt" ? "text" : language;

  return (
    <figure className="my-9 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1020]">
      <figcaption className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="font-mono text-xs text-slate-300">
          {label}
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-0 text-[0.86rem] leading-7 text-slate-100">
        <code className="block min-w-full py-5">
          {lines.map((line, index) => (
            <span
              key={`${index}-${line}`}
              className="grid grid-cols-[3.25rem_1fr] px-4 transition-colors hover:bg-white/[0.035]"
            >
              <span className="select-none pr-4 text-right font-mono text-xs text-slate-400">
                {index + 1}
              </span>
              <span className="whitespace-pre font-mono">{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

function ImageBlock({ alt, src }: { alt: string; src: string }) {
  return (
    <figure className="my-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04]">
      <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </figure>
  );
}

export function MarkdownArticle({
  markdown,
  skipFirstHeading = false,
  skipFirstImage = false,
}: {
  markdown: string;
  skipFirstHeading?: boolean;
  skipFirstImage?: boolean;
}) {
  const blocks = parseBlocks(markdown);
  let renderedBlocks =
    skipFirstHeading && blocks[0]?.type === "heading" && blocks[0].depth === 1
      ? blocks.slice(1)
      : blocks;

  if (skipFirstImage) {
    const firstImageIndex = renderedBlocks.findIndex(
      (block) => block.type === "image",
    );

    if (firstImageIndex >= 0) {
      renderedBlocks = renderedBlocks.filter(
        (_, index) => index !== firstImageIndex,
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {renderedBlocks.map((block, index) => {
        if (block.type === "heading") {
          const id = headingId(block.text);

          if (block.depth === 1) {
            return (
              <h1
                key={index}
                id={id}
                className="mt-14 scroll-mt-28 text-4xl font-black leading-tight text-slate-950 first:mt-0 dark:text-white md:text-5xl"
              >
                {renderInline(block.text)}
              </h1>
            );
          }

          if (block.depth === 2) {
            return (
              <h2
                key={index}
                id={id}
                className="mt-14 scroll-mt-28 text-3xl font-black leading-tight text-slate-950 dark:text-white"
              >
                {renderInline(block.text)}
              </h2>
            );
          }

          return (
            <h3
              key={index}
              id={id}
              className="mt-10 scroll-mt-28 text-2xl font-bold leading-tight text-slate-950 dark:text-white"
            >
              {renderInline(block.text)}
            </h3>
          );
        }

        if (block.type === "image") {
          return <ImageBlock key={index} alt={block.alt} src={block.src} />;
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={index}
              className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300"
            >
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote
              key={index}
              className="my-8 border-l-4 border-primary bg-blue-50/70 py-4 pl-6 pr-5 text-xl font-semibold leading-8 text-slate-950 dark:bg-blue-400/10 dark:text-sky-50"
            >
              {renderInline(block.text)}
            </blockquote>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={index}
              className="mt-6 space-y-3 text-lg leading-8 text-slate-700 dark:text-slate-300"
            >
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <CodeBlock key={index} code={block.code} language={block.language} />
        );
      })}
    </div>
  );
}
