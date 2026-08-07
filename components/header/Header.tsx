/**
 * Header
 * ------
 * Site header: logo, top-level nav, cart, admin, and sign-in/profile.
 *
 * Responsive nav strategy:
 * - >= lg: full DropdownMenu row (hover flyouts), MobileNav's hamburger
 *   button is hidden.
 * - <  lg: DropdownMenu row is hidden; MobileNav's hamburger opens the same
 *   NAV_ITEMS in a slide-in drawer instead.
 *
 * "Sign In" label and full Dropdown Menu hide together at the same breakpoint
 * (lg) so the header doesn't end up half-collapsed.
 */
"use client";

import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import MobileNav from "./MobileNav";
import ThemeToggle from "../ui/ThemeToggle";
import { LogIn, LogOut, ShoppingCart, Shield, UserRound } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { buttons } from "@/lib/styles";

// A sub-item is always a simple link — no further nesting, path required.
export interface NavSubItem {
  label: string;
  path: string;
}

export interface NavItem {
  label: string;
  path?: string;
  // Optional submenu items, e.g. About Us -> Contact Information, Board of Directors.
  // Omit this field entirely for menus that don't have submenus.
  subItems?: NavSubItem[];
}

// Update this list any time the site's top-level sections change.
// Add a `subItems` array to any entry that needs a submenu.
const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Membership", path: "/membership" },
  { label: "Schedule", path: "/schedule" },

  {
    label: "Events",
    path: "/events",
    subItems: [
      { label: "Enter Rodeo", path: "/events/enter-rodeo" },
      { label: "Current Entries", path: "/events/current-entries" },
      { label: "Rodeo Draws", path: "/events/rodeo-draws" },
      { label: "Rodeo Approval Form", path: "/events/rodeo-approval" },
      { label: "Rulebook", path: "/events/rulebook" },
    ],
  },

  {
    label: "Results",
    path: "/results",
    subItems: [
      { label: "Rodeo Results", path: "/results/rodeo-results" },
      { label: "Standings", path: "/results/standings" },
      { label: "Past Champions", path: "/results/past-champions" },
    ],
  },

  { label: "Store", path: "/store" },

  {
    label: "About Us",
    path: "/about-us",
    subItems: [
      { label: "Contact Information", path: "/about-us/contact" },
      { label: "Board of Directors", path: "/about-us/board-of-directors" },
      { label: "Meeting Minutes", path: "/about-us/minutes" },
      { label: "Photo Gallery", path: "/about-us/photo-gallery" },
    ],
  },
];

export default function Header() {
  const { data: session, isPending } = useSession();
  const isSignedIn = Boolean(session?.user);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = role === "admin" || role === "superadmin";

  async function handleLogout() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo — links back to homepage */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Go to homepage"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            CCRA
          </span>
        </Link>

        {/* Desktop Navigation — hidden below lg in favor of the MobileNav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          <ul className="m-0 flex list-none items-center gap-6 p-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <DropdownMenu
                  label={item.label}
                  path={item.path}
                  subItems={item.subItems}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Nav + Cart + Admin + Profile */}
        <div className="flex shrink-0 items-center gap-2">
          <MobileNav items={NAV_ITEMS} />

          <ThemeToggle />

          <Link
            href="/cart"
            className={buttons.iconButton}
            aria-label="View cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`${buttons.iconButtonHighlight} text-accent-foreground hover:text-accent-foreground`}
              aria-label="Admin Dashboard"
            >
              <Shield className="h-5 w-5" />
            </Link>
          )}

          {/* While the session is loading, render a same-sized placeholder to
              avoid a layout shift / flash between the two states below. */}
          {isPending ? (
            <div className="h-10 w-10" aria-hidden="true" />
          ) : isSignedIn ? (
            <>
              <Link
                href="/profile"
                className={buttons.iconButton}
                aria-label="View profile"
              >
                <UserRound className="h-5 w-5" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover lg:px-5 lg:py-3"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="hidden whitespace-nowrap lg:inline">
                  Sign Out
                </span>
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover lg:px-5 lg:py-3"
              aria-label="Sign In"
            >
              <LogIn className="h-4 w-4 shrink-0" />
              <span className="hidden whitespace-nowrap lg:inline">
                Sign In
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
