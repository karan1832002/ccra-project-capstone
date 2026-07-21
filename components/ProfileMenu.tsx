"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown, UserRound, X } from "lucide-react";

export interface ProfileSubLink {
  label: string;
  path: string;
}

export interface ProfileLink {
  label: string;
  path?: string;
  // Optional collapsible sub-links, e.g. "Account" -> "My Profile", "Order History"
  subItems?: ProfileSubLink[];
}

// TODO: replace with real links as pages are created.
// Structure supports plain links (just a path) and collapsible parents (a subItems array instead of a path).
const PROFILE_LINKS: ProfileLink[] = [
  { label: "Profile Information", path: "/profile" },
  {
    label: "Membership",
    subItems: [
      { label: "Membership Application", path: "/profile" },
      { label: "Pay Fees", path: "/profile" },
    ],
  },
  { label: "Payment Methods", path: "/profile" },
  { label: "Current Entries", path: "/profile" },
  { label: "Purchase History", path: "/profile" },
  { label: "Sign Out", path: "/" },
];

// TODO: replace with real membership status, likely pulled from auth/user state
const MEMBERSHIP_STATUS = "Active Member";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedLabels, setExpandedLabels] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // document.body doesn't exist during server rendering, so only create the
  // portal once the component has mounted in the browser.
  useEffect(() => {
    setMounted(true);
  }, []);

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

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-700 transition hover:bg-stone-100"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-controls="profile-sidebar"
      >
        <UserRound className="h-5 w-5" />
      </button>

      {mounted &&
        createPortal(
          <div
            className={
              isOpen
                ? "fixed inset-0 z-50 pointer-events-auto"
                : "fixed inset-0 z-50 pointer-events-none"
            }
          >
            {/* Backdrop — click outside to close */}
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close profile menu overlay"
              className={
                isOpen
                  ? "absolute inset-0 bg-stone-950/45 opacity-100 transition-opacity duration-300 ease-in-out"
                  : "absolute inset-0 bg-stone-950/45 opacity-0 transition-opacity duration-300 ease-in-out"
              }
            />

            {/* Sidebar panel */}
            <aside
              id="profile-sidebar"
              className={
                isOpen
                  ? "absolute right-0 top-0 h-full w-[85%] max-w-sm translate-x-0 overflow-y-auto bg-white p-5 shadow-lg transition-transform duration-300"
                  : "absolute right-0 top-0 h-full w-[85%] max-w-sm translate-x-full overflow-y-auto bg-white p-5 shadow-2lg transition-transform duration-300"
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-950">
                  My Account
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-700 transition hover:bg-stone-100"
                  aria-label="Close profile menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Membership status */}
              <div className="mt-4 rounded-md bg-stone-100 px-3 py-2 text-sm font-medium text-stone-700">
                Membership Status: {MEMBERSHIP_STATUS}
              </div>

              <nav className="mt-6 grid gap-1">
                {PROFILE_LINKS.map((item) => {
                  const hasSubItems = Boolean(
                    item.subItems && item.subItems.length > 0,
                  );
                  const isExpanded = expandedLabels.has(item.label);

                  if (hasSubItems) {
                    return (
                      <div key={item.label}>
                        <button
                          type="button"
                          onClick={() => toggleSection(item.label)}
                          className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium text-stone-800 transition hover:bg-stone-100"
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
                                href={subItem.path}
                                onClick={closeMenu}
                                className="rounded-md px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.path ?? "#"}
                      onClick={closeMenu}
                      className="rounded-md px-3 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
}