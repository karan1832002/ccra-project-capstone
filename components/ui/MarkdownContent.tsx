"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// --- Markdown Content Renderer ---
// Thin client wrapper around react-markdown with GFM plugin support.
// Enables tables, strikethrough, task lists, and autolinks in addition
// to standard CommonMark. The parent server component fetches the raw
// markdown string and passes it as a prop; this component handles the
// React tree rendering in the browser.

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}