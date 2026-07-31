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
 * "Sign In" label and full Dropdown Menu hide together at the same breakpoint
 * (lg) so the header doesn't end up half-collapsed.
 */
"use client";

import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import ProfileMenu from "./ProfileMenu";
import MobileNav from "./MobileNav";
import { LogIn, ShoppingCart, Shield } from "lucide-react";
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
  subItems?: NavSubItem[];
}

// ⭐ UPDATED NAV ITEMS — EXACT ORDER YOU REQUESTED
const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Membership", path: "/membership" },
  { label: "Schedule", path: "/schedule" },

  {
    label: "Events",
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

  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-stone-950"
          aria-label="Go to homepage"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-600 text-sm font-semibold text-white">
            CCRA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
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

        {/* Mobile Nav + Cart + Profile */}
        <div className="flex shrink-0 items-center gap-2">
          <MobileNav items={NAV_ITEMS} />

          <Link
            href="/cart"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-700 transition hover:bg-stone-100"
            aria-label="View cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-orange-600 transition hover:bg-orange-50"
              aria-label="Admin Dashboard"
            >
              <Shield className="h-5 w-5" />
            </Link>
          )}

          {isPending ? (
            <div className="h-10 w-10" aria-hidden="true" />
          ) : isSignedIn ? (
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
