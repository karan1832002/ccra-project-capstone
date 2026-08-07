/**
 * DrawFileList
 * ------------
 * Draws-specific body content for a RodeoEventCard. Renders each posted
 * sheet (draw or day) as a clickable chip linking straight to the file —
 * no intermediate viewer page.
 */

import React from "react";
import { SheetFile } from "@/types/rodeo";

interface DrawFileListProps {
  files: SheetFile[];
}

// Human-readable labels for the two sheet types, shown next to each file link.
const typeLabel: Record<SheetFile["type"], string> = {
  draw: "Draw sheet",
  day: "Day sheet",
};

// Small text badge indicating file format ("PDF"/"XLS").
function fileIcon(fileType: SheetFile["fileType"]) {
  return fileType === "xlsx" ? "XLS" : "PDF";
}

// Draws-specific body content for a RodeoEventCard: renders each file as a
// clickable chip linking straight to the PDF/XLSX (no intermediate page).
export function DrawFileList({ files }: DrawFileListProps) {
  if (files.length === 0) {
    return <p className="text-sm text-stone-600">No sheets posted yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file) => (
        <a
          key={file.id}
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50"
        >
          <span className="text-xs font-semibold text-stone-600">
            {fileIcon(file.fileType)}
          </span>
          <span>{file.label}</span>
          <span className="text-xs text-stone-600">({typeLabel[file.type]})</span>
        </a>
      ))}
    </div>
  );
}

export default DrawFileList;