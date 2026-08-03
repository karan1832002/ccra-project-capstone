"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled — the editor relies on browser APIs
// (CodeMirror under the hood) and cannot render on the server.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// --- Markdown Editor ---
// Client component that renders a Markdown editor and syncs its value
// to a hidden <textarea name={name}>. This allows the editor to work
// within a server-action <form> — the server reads the markdown string
// from FormData via the hidden field, while the user interacts with
// the rich MD editor UI.
//
// Wrapped in data-color-mode="light" to enforce light-mode theming
// regardless of system preferences.

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
}

export default function MarkdownEditor({
  name,
  defaultValue = "",
}: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = useCallback(
    (val: string | undefined) => {
      setValue(val ?? "");
    },
    [],
  );

  return (
    <div data-color-mode="light" className="rounded-md border border-stone-200 overflow-hidden shadow-sm">
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="edit"
        height={320}
        visibleDragbar={false}
      />
      {/* Hidden field bridges the editor state into FormData for server actions */}
      <input type="hidden" name={name} value={value} readOnly />
    </div>
  );
}