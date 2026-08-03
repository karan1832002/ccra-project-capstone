"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export interface NavListItem {
  label: string;
  path?: string;
  subItems?: NavListItem[];
  action?: () => void;
}

export interface NavListProps {
  items: NavListItem[];
  onNavigate: () => void;
  className?: string;
}

export default function NavList({
  items,
  onNavigate,
  className,
}: NavListProps) {
  const [expandedLabels, setExpandedLabels] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role ?? "member";
  const isAdminRole = role === "admin" || role === "superadmin";

  const isActive = (path?: string) =>
    path && pathname.startsWith(path);

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

        if (!hasSubItems) {
          if (item.action) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.action!();
                  onNavigate();
                }}
                className="rounded-md px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 w-full text-left"
              >
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.path ?? "#"}
              onClick={onNavigate}
              className={
                isActive(item.path)
                  ? "rounded-md px-3 py-3 text-sm font-semibold text-orange-600 underline underline-offset-4"
                  : "rounded-md px-3 py-3 text-sm font-medium text-stone-950 transition hover:bg-orange-50"
              }
            >
              {item.label}
            </Link>
          );
        }

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
                {item.subItems!.map((subItem) => {
                  const subActive = isActive(subItem.path);

                  return (
                    <Link
                      key={subItem.label}
                      href={subItem.path ?? "#"}
                      onClick={onNavigate}
                      className={
                        subActive
                          ? "rounded-md px-3 py-2 text-sm font-semibold text-orange-600 underline underline-offset-4"
                          : "rounded-md px-3 py-2 text-sm text-stone-650 transition hover:bg-orange-50 hover:text-stone-950"
                      }
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

      {isAdminRole && (
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
