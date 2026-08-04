"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, ExternalLink, Calendar } from "lucide-react";

export interface MinuteEntryData {
  id: string;
  title: string;
  date: string;
  location?: string;
  summary: string;
  fullContent?: string;          // Optional text content
  googleDocUrl?: string;         // Link to Google Doc
}

interface MinuteEntryProps {
  entry: MinuteEntryData;
}

export default function MinuteEntry({ entry }: MinuteEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-md border border-stone-200 bg-white shadow-sm overflow-hidden dark:border-stone-700 dark:bg-stone-900">
      {/* Card Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 sm:p-8 flex items-start gap-4 hover:bg-stone-50 transition dark:hover:bg-stone-800/50"
      >
        <div className="w-12 h-12 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0 dark:bg-orange-950/40 dark:text-orange-400">
          <FileText className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <h2 className="text-xl font-semibold text-stone-950 dark:text-stone-100">
              {entry.title}
            </h2>
            <span className="inline-flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400">
              <Calendar className="w-3.5 h-3.5" />
              {entry.date}
            </span>
          </div>

          {entry.location && (
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">
              {entry.location}
            </p>
          )}

          <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
            {entry.summary}
          </p>
        </div>

        <div className="text-stone-400 dark:text-stone-500 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 sm:px-8 pb-8 border-t border-stone-200 dark:border-stone-700">
          {/* Text content (if provided) */}
          {entry.fullContent && (
            <div className="pt-6">
              <pre className="whitespace-pre-wrap text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {entry.fullContent}
              </pre>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {entry.googleDocUrl && (
              <a
                href={entry.googleDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                <ExternalLink className="w-4 h-4" />
                Open Google Doc
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}