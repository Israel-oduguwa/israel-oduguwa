import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const directory = resolve("editorial/medium");
mkdirSync(directory, { recursive: true });
const exports = [];
const escape = (text) => text.replace(/[&<>\"]/g,
  (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
const displayDate = (value) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${value}T00:00:00Z`));
const inline = (text) => {
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let html = "", index = 0;
  for (const match of text.matchAll(pattern)) {
    html += escape(text.slice(index, match.index));
    const token = match[0];
    if (token.startsWith("**")) html += `<strong>${escape(token.slice(2, -2))}</strong>`;
    else if (token.startsWith("*")) html += `<em>${escape(token.slice(1, -1))}</em>`;
    // Medium imports inline <code> as a separate block; keep these tokens inline.
    else if (token.startsWith("`")) html += escape(token.slice(1, -1));
    else {
      const [, label, url] = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!/^https?:\/\//.test(url)) throw new Error(`Unsupported link: ${url}`);
      html += `<a href="${escape(url)}">${escape(label)}</a>`;
    }
    index = match.index + token.length;
  }
  return html + escape(text.slice(index));
};
const toHtml = (body) => {
  const lines = body.split("\n"), blocks = [];
  for (let i = 0; i < lines.length;) {
    if (!lines[i].trim()) { i++; continue; }
    if (lines[i].startsWith("```")) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      if (i === lines.length) throw new Error("Unclosed code block");
      blocks.push(`<pre>${escape(code.join("\n"))}</pre>`); i++; continue;
    }
    const heading = lines[i].match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${inline(heading[2])}</h${level}>`); i++; continue;
    }
    if (lines[i].startsWith("- ")) {
      const items = [];
      while (lines[i]?.startsWith("- ")) items.push(`<li>${inline(lines[i++].slice(2))}</li>`);
      blocks.push(`<ul>${items.join("")}</ul>`); continue;
    }
    if (lines[i].startsWith("> ")) {
      const quote = [];
      while (lines[i]?.startsWith("> ")) quote.push(lines[i++].slice(2));
      blocks.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`); continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim()) paragraph.push(lines[i++]);
    blocks.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }
  return blocks.join("\n");
};
for (const file of readdirSync("articles").filter((name) => name.endsWith(".md"))) {
  const source = readFileSync(resolve("articles", file), "utf8");
  const header = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!header) throw new Error(`Missing metadata: ${file}`);
  const field = (name) => {
    const value = header[1].match(new RegExp(`^${name}:\\s*"?([^"\\n]+)"?$`, "m"))?.[1];
    if (!value) throw new Error(`Missing ${name}: ${file}`);
    return value;
  };
  const slug = field("slug");
  const title = field("title");
  const contextDate = header[1].match(/^contextDate:\s*"([^"]+)"/m)?.[1] ?? null;
  const url = `https://israel-oduguwa.vercel.app/articles/${slug}`;
  const body = source.slice(header[0].length).trim()
    .replace(/\]\((\/(?!\/)[^)]+)\)/g,
      "](https://israel-oduguwa.vercel.app$1)");
  const disclosure = contextDate
    ? "This article was written with AI assistance. Sources and example verification are linked where relevant."
    : slug === "validating-ai-coding-benchmarks"
    ? "This article was written with AI assistance. The linked experiment includes runnable code and recorded results."
    : "This article was edited with AI assistance.";
  const contextNote = contextDate
    ? `Technical context: ${displayDate(contextDate)}. Published ${displayDate(field("date"))}; the context date describes the technical era examined.`
    : "";
  writeFileSync(resolve(directory, `${slug}.md`),
    `# ${title}\n\n${field("description")}\n\n${disclosure}\n\n${contextNote ? `${contextNote}\n\n` : ""}${body}\n\nOriginally published on [Israel Oduguwa's website](${url}).\n`);
  // Medium rejected these body links; import still retains the canonical URL.
  const mediumBody = toHtml(body).replace(
    /<a href="https:\/\/israel-oduguwa\.vercel\.app[^\"]*">([\s\S]*?)<\/a>/g, "$1");
  writeFileSync(resolve(directory, `${slug}.html`),
    `<h1>${escape(title)}</h1>\n<h2>${escape(field("description"))}</h2>\n<p>${disclosure}</p>\n${contextNote ? `<p>${contextNote}</p>\n` : ""}${mediumBody}\n<p>Originally published on Israel Oduguwa's website.</p>\n`);
  exports.push({ slug, title, canonicalUrl: url, originalDate: field("date"),
    contextDate,
    updatedAt: header[1].match(/^updatedAt:\s*"([^"]+)"/m)?.[1] ?? null,
    markdown: `${slug}.md`, html: `${slug}.html`, disclosure });
}
exports.sort((a, b) => b.originalDate.localeCompare(a.originalDate));
writeFileSync(resolve(directory, "manifest.json"), `${JSON.stringify(exports, null, 2)}\n`);
console.log(`Prepared ${exports.length} Medium versions in editorial/medium.`);
