"use client";

import { useEffect, useState, useCallback } from "react";
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
// The editor theme follows the site's dark mode: a MutationObserver
// watches the .dark class on <html> and toggles the data-color-mode
// attribute so the editor's built-in dark/light palettes stay in sync
// with the rest of the admin UI.

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
}

function readColorMode(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function MarkdownEditor({
  name,
  defaultValue = "",
}: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Defaults to "light" on the server to match SSR; correct to the live
    // theme once mounted, then keep watching for future toggles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColorMode(readColorMode());

    const observer = new MutationObserver(() => {
      setColorMode(readColorMode());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleChange = useCallback(
    (val: string | undefined) => {
      setValue(val ?? "");
    },
    [],
  );

  return (
    <div
      data-color-mode={colorMode}
      className="rounded-md border border-border overflow-hidden shadow-sm"
    >
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
