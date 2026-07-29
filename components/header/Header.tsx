/**
 * Header
 * ------
 * Site header: logo, top-level nav, cart, and sign-in/profile.
 *
 * Responsive nav strategy:
 * - >= lg: full DropdownMenu row (hover flyouts), MobileNav's hamburger
 *   button is hidden.
 * - <  lg: DropdownMenu row is hidden; MobileNav's hamburger opens the same
 *   NAV_ITEMS in a slide-in drawer instead.
 *
 * Logo subtitle and "Sign In" label hide together at the same breakpoint
 * (lg) so the header doesn't end up half-collapsed.
 */
"use client";

import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import ProfileMenu from "./ProfileMenu";
import MobileNav from "./MobileNav";
import { LogIn, ShoppingCart } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

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
  // An item has either a path OR subItems, never both.
  subItems?: NavSubItem[];
}

// Update this list any time the site's top-level sections change.
// Add a `subItems` array to any entry that needs a submenu.
const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  {
    label: "About Us", path: "/about-us",
    subItems: [
      { label: "Contact Information", path: "/about-us/contact" },
      { label: "Board of Directors", path: "/about-us/board-of-directors" },
      { label: "Meeting Minutes", path: "/about-us/minutes" },
      { label: "Photo Gallery", path: "/about-us/photo-gallery" },
    ],
  },
  { label: "Schedule", path: "/schedule" },
  {
    label: "Events",
    subItems: [
      { label: "Enter Rodeo", path: "/events/enter-rodeo" },
      { label: "Rodeo Entries", path: "/events/current-entries" },
      { label: "Rodeo Draws", path: "/events/rodeo-draws" },
      { label: "Rodeo Approval Form", path: "/events/rodeo-approval" },
      { label: "Rulebook", path: "/events/rulebook" },
    ],
  },
  {
    label: "Results",
    subItems: [
      { label: "Rodeo Results", path: "/results/rodeo-results" },
      { label: "Standings", path: "/results/standings" },
      { label: "Past Champions", path: "/results/past-champions" },
    ],
  },
  { label: "Store", path: "/store" },
];

export default function Header() {
  const { data: session, isPending } = useSession();
  const isSignedIn = Boolean(session?.user);

  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo — links back to homepage */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-stone-950"
          aria-label="Go to homepage"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-600 text-sm font-semibold text-white">
            CCRA
          </span>
          <span className="hidden whitespace-nowrap text-sm font-semibold leading-tight lg:block">
            Canadian Classic
            <br />
            Rodeo Association
          </span>
        </Link>

        {/* Dropdown nav menus — hidden below lg in favor of the MobileNav hamburger */}
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

        {/* Hamburger (mobile) + cart + profile/sign-in */}
        <div className="flex shrink-0 items-center gap-2">
          <MobileNav items={NAV_ITEMS} />
          <Link
            href="/cart"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-700 transition hover:bg-stone-100"
            aria-label="View cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {/* While the session is loading, render a same-sized placeholder to
              avoid a layout shift / flash between the two states below. */}
          {isPending ? (
            <div className="h-10 w-10" aria-hidden="true" />
          ) : isSignedIn ? (
            // Profile icon + its menu logic live in ProfileMenu.tsx
            <ProfileMenu />
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-orange-600 px-3 text-sm font-semibold text-white transition hover:bg-orange-700 lg:px-5 lg:py-3"
              aria-label="Sign In"
            >
              <LogIn className="h-4 w-4 shrink-0" />
              <span className="hidden whitespace-nowrap lg:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}