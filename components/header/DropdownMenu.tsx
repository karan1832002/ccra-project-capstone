/**
 * DropdownMenu
 * ------------
 * A single top-level desktop nav entry. On hover it reveals a flyout list of
 * sub-items (if it has any). This is the >= lg desktop equivalent of the
 * "expandable" item behavior in NavList — same underlying data shape, but a
 * hover-flyout instead of an inline expand, since desktop has room for it.
 *
 * Rendered once per entry in Header's NAV_ITEMS.
 */
"use client";

import { useState } from "react";
import Link from "next/link";

// A single sub-item shown in the flyout (always a plain link — no further nesting).
export interface DropdownMenuItem {
  label: string;
  path: string;
}

// Props for one top-level nav entry.
export interface DropdownMenuProps {
  label: string;
  path?: string;
  subItems?: DropdownMenuItem[];
}

export default function DropdownMenu({
  label,
  path,
  subItems,
}: DropdownMenuProps) {
  // Whether the flyout is currently visible (opened by hover, or by tapping
  // the heading when it has no path of its own — see below).
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = Boolean(subItems && subItems.length > 0);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Heading — links to its own path when it has one, otherwise acts as a
          click/tap toggle for the submenu (hover already opens it on desktop) */}
      {path ? (
        <Link
          href={path}
          className="inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-orange-50 hover:text-stone-950"
        >
          {label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-orange-50 hover:text-stone-950"
          aria-haspopup={hasSubItems ? "true" : undefined}
          aria-expanded={hasSubItems ? isOpen : undefined}
        >
          {label}
        </button>
      )}

      {/* Dropdown Menu - only displays if submenu items exist */}
      {hasSubItems && isOpen && (
        <div className="absolute top-full left-0 min-w-[180px] rounded-md border border-stone-200 bg-white p-2 shadow-lg z-20">
          <ul className="m-0 list-none p-0">
            {subItems!.map((subItem) => (
              <li key={subItem.label}>
                <Link
                  href={subItem.path}
                  className="block rounded-md px-3 py-2 text-sm text-stone-600 transition hover:bg-orange-50 hover:text-stone-950"
                >
                  {subItem.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}