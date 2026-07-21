"use client";

import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import ProfileMenu from "./ProfileMenu";
import { LogIn, ShoppingCart } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export interface NavItem {
  label: string;
  path: string;
  // Optional submenu items, e.g. About Us -> Contact Information, Board of Directors.
  // Omit this field entirely for menus that don't have submenus.
  subItems?: NavItem[];
}

// Update this list any time the site's top-level sections change.
// Add a `subItems` array to any entry that needs a submenu.
const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  {
    label: "About Us",
    path: "/about",
    subItems: [
      { label: "Contact Information", path: "/about/contact" },
      { label: "Board of Directors", path: "/about/board-of-directors" },
      { label: "Meeting Minutes", path: "/about/minutes" },
      { label: "Photo Gallery", path: "/about/photo-gallery" },
    ],
  },
  { label: "Schedule", path: "/schedule" },
  {
    label: "Events",
    path: "/events",
    subItems: [
      { label: "Enter Rodeo", path: "/events/rodeo-entries" },
      { label: "Rodeo Entries", path: "/events/current-entries" },
      { label: "Rodeo Draws", path: "/events/rodeo-draws" },
      { label: "Rodeo Approval Form", path: "/events/rodeo-approval" },
      { label: "Rulebook", path: "/events/rulebook" },
      { label: "Partner Search Page", path: "/events/partner-search" },
    ],
  },
  {
    label: "Results",
    path: "/results",
    subItems: [
      { label: "Rodeo Results", path: "/results/rodeo-results" },
      { label: "Standings", path: "/results/standings" },
      { label: "past-champions", path: "/results/past-champions" },
    ],
  },
  { label: "Store", path: "/store" },
];

export default function Header() {
  const { data: session, isPending } = useSession();
  const isSignedIn = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — links back to homepage */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-stone-950"
          aria-label="Go to homepage"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-600 text-sm font-bold text-white">
            CCRA
          </span>
          <span className="hidden min-w-0 text-sm font-semibold leading-tight sm:block">
            Canadian Classic
            <br />
            Rodeo Association
          </span>
        </Link>

        {/* Dropdown nav menus — actual dropdown contents built out in DropdownMenu.tsx */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <ul className="flex list-none items-center gap-6 m-0 p-0">
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

        {/* Cart + profile/sign-in */}
        <div className="flex items-center gap-2">
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
              className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}