/**
 * NavList
 * -------
 * A vertical list of nav links, some of which can expand in place to reveal
 * sub-links (e.g. "About Us" -> "Contact Information", "Board of Directors").
 *
 * This component only knows about rendering links — it has no idea it's
 * usually shown inside a `Sidebar`. That's intentional: it could just as
 * easily be dropped into a footer or any other plain container.
 *
 * Used by:
 * - components/header/MobileNav.tsx   (renders NAV_ITEMS)
 * - components/header/ProfileMenu.tsx (renders PROFILE_LINKS)
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface NavListItem {
  label: string;
  // An item has either a path (plain link) or subItems (expandable), never both.
  path?: string;
  subItems?: NavListItem[];
}

export interface NavListProps {
  items: NavListItem[];
  // Called whenever a link is clicked, so the parent can close the sidebar.
  onNavigate: () => void;
  className?: string;
}

export default function NavList({
  items,
  onNavigate,
  className,
}: NavListProps) {
  // Tracks which top-level labels currently have their sub-items expanded.
  const [expandedLabels, setExpandedLabels] = useState<Set<string>>(new Set());

  function toggleSection(label: string) {
    setExpandedLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  return (
    <nav className={className ?? "grid gap-1"}>
      {items.map((item) => {
        const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
        const isExpanded = expandedLabels.has(item.label);

        // Plain item: just a link, no expand/collapse behavior.
        if (!hasSubItems) {
          return (
            <Link
              key={item.label}
              href={item.path ?? "#"}
              onClick={onNavigate}
              className="rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
            >
              {item.label}
            </Link>
          );
        }

        // Expandable item: a toggle button for the label, plus an indented
        // list of sub-links that only renders once expanded.
        return (
          <div key={item.label}>
            <button
              type="button"
              onClick={() => toggleSection(item.label)}
              className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium text-stone-950 transition hover:bg-orange-50"
              aria-expanded={isExpanded}
            >
              {item.label}
              <ChevronDown
                className={
                  isExpanded
                    ? "h-4 w-4 rotate-180 transition-transform"
                    : "h-4 w-4 transition-transform"
                }
              />
            </button>

            {isExpanded && (
              <div className="ml-3 grid gap-1 border-l border-stone-200 pl-3">
                {item.subItems!.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.path ?? "#"}
                    onClick={onNavigate}
                    className="rounded-md px-3 py-2 text-sm text-stone-650 transition hover:bg-orange-50 hover:text-stone-950"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}