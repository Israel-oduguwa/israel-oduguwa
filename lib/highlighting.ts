import { createHighlighter, type BundledLanguage } from "shiki";

export const codeBackground = "#0b1020";
const languages = ["javascript", "typescript", "tsx", "sql", "json", "bash", "python", "html", "css", "yaml", "diff"];
const aliases: Record<string, string> = {
  js: "javascript", ts: "typescript", jsx: "tsx", sh: "bash",
  shell: "bash", txt: "text", plaintext: "text",
};
const labels: Record<string, string> = {
  javascript: "JavaScript", typescript: "TypeScript", tsx: "React / TypeScript",
  sql: "SQL", json: "JSON", bash: "Shell", python: "Python",
  html: "HTML", css: "CSS", yaml: "YAML", diff: "Diff", text: "Text",
};
let highlighter: ReturnType<typeof createHighlighter> | undefined;

function luminance(channels: number[]) {
  const linear = channels.map(value => {
    const scaled = value / 255;
    return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

export function readableCodeColor(color = "#e2e8f0") {
  const match = /^#([0-9a-f]{6})$/i.exec(color);
  if (!match) return "#e2e8f0";
  const rgb = [0, 2, 4].map(offset => parseInt(match[1].slice(offset, offset + 2), 16));
  const backgroundLuminance = luminance([11, 16, 32]);
  while ((luminance(rgb) + 0.05) / (backgroundLuminance + 0.05) < 4.5) {
    for (let index = 0; index < rgb.length; index++) {
      rgb[index] = Math.min(255, rgb[index] + 4);
    }
  }
  return `#${rgb.map(value => value.toString(16).padStart(2, "0")).join("")}`;
}

export async function highlightCode(code: string, language: string) {
  const normalized = aliases[language.toLowerCase()] ?? language.toLowerCase();
  const label = labels[normalized] ?? language;
  if (!languages.includes(normalized)) {
    return { label, lines: code.split("\n").map(content => [{ content, color: "#e2e8f0" }]) };
  }
  highlighter ??= createHighlighter({ themes: ["github-dark"], langs: languages });
  const engine = await highlighter;
  const { tokens } = engine.codeToTokens(code, { lang: normalized as BundledLanguage, theme: "github-dark" });
  return { label, lines: tokens.map(line => line.map(token => ({
    content: token.content,
    color: readableCodeColor(token.color),
  }))) };
}
