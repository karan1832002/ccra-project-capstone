"use client";

/**
 * NavList
 * -------
 * Renders a vertical navigation list for the site header (used in things like
 * mobile menus or dropdown panels).
 *
 * Behavior:
 * - Plain items render as a `Link` (or a destructive-styled `button` if an
 *   `action` is provided instead of a `path`, e.g. "Log out").
 * - Items with `subItems` render as an expandable/collapsible group. The
 *   label itself is a `Link` when the item has a `path` (so the group header
 *   can navigate directly), or plain text when it doesn't. A separate
 *   chevron button toggles the nested list of sub-item `Link`s independently
 *   of the label.
 * - Active route highlighting is done via `usePathname()` + `isActive()`.
 */

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export interface NavListItem {
  label: string;
  path?: string; // route to navigate to; omitted for group headers with no link, or action items
  subItems?: NavListItem[]; // if present, this item renders as an expandable group
  action?: () => void; // if present, item renders as a button (e.g. logout) instead of a link
}

export interface NavListProps {
  items: NavListItem[];
  onNavigate: () => void; // called after a nav Link/action is triggered (e.g. to close a mobile menu)
  className?: string;
}

export default function NavList({
  items,
  onNavigate,
  className,
}: NavListProps) {
  // Tracks which group labels are currently expanded (dropdown open)
  const [expandedLabels, setExpandedLabels] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role ?? "member";
  const isAdminRole = role === "admin" || role === "superadmin";
  const isAdminRoute = pathname.startsWith("/admin");
  // Admin links only render when the user holds an admin role AND is
  // currently browsing within the /admin dashboard, keeping the public
  // mobile nav free of admin clutter.
  const showAdminLinks = isAdminRole && isAdminRoute;

  // Determines whether a given path should be styled as "active"
  // Root path ("/") requires an exact match; everything else uses startsWith
  // so nested routes under a section still highlight the parent link.
  const isActive = (path?: string) => {
    if (!path) return false;
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  // Toggles a group's expanded/collapsed state by label
  function toggleSection(label: string) {
    setExpandedLabels((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  return (
    <nav className={className ?? "grid gap-1"}>
      {items.map((item) => {
        const hasSubItems = Boolean(item.subItems?.length);
        const isExpanded = expandedLabels.has(item.label);

        // --- Case 1: simple item, no subItems ---
        if (!hasSubItems) {
          // 1a: action item (e.g. "Log out") — renders as a button, not a Link
          if (item.action) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.action!();
                  onNavigate();
                }}
                className="rounded-md px-3 py-3 text-sm font-medium text-primary-foreground bg-primary transition hover:bg-primary-hover w-full text-left"
              >
                {item.label}
              </button>
            );
          }

          // 1b: standard nav link, styled differently when it matches the current route
          return (
            <Link
              key={item.label}
              href={item.path ?? "#"}
              onClick={onNavigate}
              className={`rounded-md px-3 py-3 text-sm ${
                isActive(item.path)
                  ? "font-semibold text-primary underline underline-offset-4"
                  : "font-medium text-foreground transition hover:bg-highlight"
              }`}
            >
              {item.label}
            </Link>
          );
        }

        // --- Case 2: group item with subItems ---
        // The label and the chevron are separate clickable elements: the
        // label navigates (when item.path is set) while the chevron button
        // toggles the nested dropdown, so the two actions don't conflict.
        const labelActive = isActive(item.path);

        const labelClassName = `flex-1 rounded-md py-3 pl-3 text-left text-sm ${
          labelActive
            ? "font-semibold text-primary underline underline-offset-4"
            : item.path
              ? "font-medium text-foreground transition hover:bg-highlight"
              : "font-medium text-foreground"
        }`;

        return (
          <div key={item.label}>
            <div className="flex items-stretch rounded-md transition hover:bg-highlight">
              {/* Label: a real Link when item.path is set, otherwise plain text */}
              {item.path ? (
                <Link
                  href={item.path}
                  onClick={onNavigate}
                  className={labelClassName}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={labelClassName}>{item.label}</span>
              )}
              {/* Chevron button: dedicated hit target for expanding/collapsing the group */}
              <button
                type="button"
                onClick={() => toggleSection(item.label)}
                aria-expanded={isExpanded}
                aria-label={`Toggle ${item.label} submenu`}
                className="flex items-center px-3 py-3"
              >
                {/* Chevron rotates 180deg when expanded to indicate open/closed state */}
                <ChevronDown
                  className={`h-4 w-4 transition-transform
                    ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Nested sub-item links, only rendered while expanded */}
            {isExpanded && (
              <div className="ml-3 grid gap-1 border-l border-border pl-3">
                {item.subItems!.map((subItem) => {
                  const subActive = isActive(subItem.path);

                  return (
                    <Link
                      key={subItem.label}
                      href={subItem.path ?? "#"}
                      onClick={onNavigate}
                      className={`rounded-md px-3 py-2 text-sm
                        ${
                          subActive
                            ? "font-semibold text-primary underline underline-offset-4"
                            : "text-foreground transition hover:bg-highlight hover:text-heading"
                        }`}
                    >
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {showAdminLinks && (
        <>
          <hr className="border-t border-stone-200" />
          <span className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Admin
          </span>

          <Link
            href="/admin"
            onClick={onNavigate}
            className={
              isActive("/admin") && pathname === "/admin"
                ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
            }
          >
            Dashboard
          </Link>

          {role === "superadmin" && (
            <Link
              href="/admin/users"
              onClick={onNavigate}
              className={
                isActive("/admin/users")
                  ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                  : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
              }
            >
              Users
            </Link>
          )}

          <Link
            href="/admin/events"
            onClick={onNavigate}
            className={
              isActive("/admin/events")
                ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
            }
          >
            Events
          </Link>

          <Link
            href="/admin/products"
            onClick={onNavigate}
            className={
              isActive("/admin/products")
                ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
            }
          >
            Products
          </Link>

          <Link
            href="/admin/orders"
            onClick={onNavigate}
            className={
              isActive("/admin/orders")
                ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
            }
          >
            Orders
          </Link>

          <Link
            href="/admin/newsletters"
            onClick={onNavigate}
            className={
              isActive("/admin/newsletters")
                ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
            }
          >
            Newsletters
          </Link>

          <Link
            href="/admin/gallery"
            onClick={onNavigate}
            className={
              isActive("/admin/gallery")
                ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
            }
          >
            Gallery
          </Link>

          <Link
            href="/admin/sponsors"
            onClick={onNavigate}
            className={
              isActive("/admin/sponsors")
                ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
            }
          >
            Sponsors
          </Link>
        </>
      )}
    </nav>
  );
}
