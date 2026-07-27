"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface DropdownMenuItem {
  label: string;
  path: string;
}

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
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = Boolean(subItems && subItems.length > 0);

  const pathname = usePathname();

  // Top-level active detection
  const isActiveTop =
    path === "/"
    ? pathname === "/"
    : path
    ? pathname.startsWith(path)
      : subItems?.some((s) => pathname.startsWith(s.path));

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Top-level heading */}
      {path ? (
        <Link
          href={path}
          className={`inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition
            ${
              isActiveTop
                ? "text-orange-600 font-semibold underline underline-offset-4"
                : "text-stone-600 hover:bg-orange-50 hover:text-stone-950"
            }
          `}
        >
          {label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className={`inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition
            ${
              isActiveTop
                ? "text-orange-600 font-semibold underline underline-offset-4"
                : "text-stone-600 hover:bg-orange-50 hover:text-stone-950"
            }
          `}
          aria-haspopup={hasSubItems ? "true" : undefined}
          aria-expanded={hasSubItems ? isOpen : undefined}
        >
          {label}
        </button>
      )}

      {/* Dropdown flyout */}
      {hasSubItems && isOpen && (
        <div className="absolute top-full left-0 min-w-[180px] rounded-md border border-stone-200 bg-white p-2 shadow-lg z-20">
          <ul className="m-0 list-none p-0">
            {subItems!.map((subItem) => {
              const subActive = pathname.startsWith(subItem.path);

              return (
                <li key={subItem.label}>
                  <Link
                    href={subItem.path}
                    className={`block rounded-md px-3 py-2 text-sm transition
                      ${
                        subActive
                          ? "text-orange-600 font-semibold bg-orange-50 underline underline-offset-4"
                          : "text-stone-600 hover:bg-orange-50 hover:text-stone-950"
                      }
                    `}
                  >
                    {subItem.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
