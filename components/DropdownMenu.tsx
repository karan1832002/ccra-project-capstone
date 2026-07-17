"use client";

import { useState } from "react";
import Link from "next/link";

// Submenu Items
export interface DropdownMenuItem {
  label: string;
  path: string;
}

// Menu Items
export interface DropdownMenuProps {
  label: string;
  path: string;
  subItems?: DropdownMenuItem[];
}

export default function DropdownMenu({
  label,
  path,
  subItems,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = Boolean(subItems && subItems.length > 0);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Heading — always links to its own path, whether or not it has a submenu */}
      <Link
        href={path}
        className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
        aria-haspopup={hasSubItems ? "true" : undefined}
        aria-expanded={hasSubItems ? isOpen : undefined}
      >
        {label}
      </Link>

      {/* Dropdown Menu - only displays if submenu items exist */}
      {hasSubItems && isOpen && (
        <div className="absolute top-full left-0 min-w-[180px] rounded-md border border-stone-200 bg-white p-2 shadow-lg z-20">
          <ul className="m-0 list-none p-0">
            {subItems!.map((subItem) => (
              <li key={subItem.label}>
                <Link
                  href={subItem.path}
                  className="block rounded px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
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
