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
          className={`inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-highlight transition
            ${
              isActiveTop
                ? "text-primary font-semibold underline underline-offset-4"
                : "text-body-text hover:text-heading-text"
            }
          `}
        >
          {label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className={`inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-highlight transition
            ${
              isActiveTop
                ? "text-primary font-semibold underline underline-offset-4"
                : "text-body-text hover:text-heading-text"
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
        <div className="absolute top-full left-0 min-w-[180px] rounded-md border border-border bg-surface p-2 shadow-lg z-20">
          <ul className="m-0 list-none p-0">
            {subItems!.map((subItem) => {
              const subActive = pathname.startsWith(subItem.path);

              return (
                <li key={subItem.label}>
                  <Link
                    href={subItem.path}
                    className={`block rounded-md px-3 py-2 text-sm hover:bg-highlight transition
                      ${
                        subActive
                          ? "text-primary font-semibold underline underline-offset-4"
                          : "text-body-text hover:text-heading-text"
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
