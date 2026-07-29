/**
 * ProfileMenu
 * -----------
 * The signed-in user's account button + slide-in drawer (membership status
 * plus account links, some of which expand in place — e.g. "Membership").
 *
 * Only rendered by Header when a session exists (see Header.tsx: isSignedIn).
 * Like MobileNav, this is mostly glue over Sidebar (overlay chrome) and
 * NavList (link rendering + expand/collapse state).
 */
"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import Sidebar from "../ui/Sidebar";
import NavList, { type NavListItem } from "../ui/NavList";

// TODO: replace with real links as pages are created.
// Structure supports plain links (just a path) and collapsible parents (a subItems array instead of a path).
const PROFILE_LINKS: NavListItem[] = [
  { label: "Profile Information", path: "/profile" },
  {
    label: "Membership",
    subItems: [
      { label: "Membership Application", path: "/profile/membership" },
      { label: "Pay Fees", path: "/profile/membership" },
    ],
  },
  { label: "Current Entries", path: "/profile/user-entries" },
  { label: "Purchase History", path: "/profile/purchase-history" },
  { label: "Sign Out", path: "/" },
];

// TODO: replace with real membership status, likely pulled from auth/user state
const MEMBERSHIP_STATUS = "Active Member";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Profile icon trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-600 transition hover:bg-orange-50"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-controls="profile-sidebar"
      >
        <UserRound className="h-5 w-5" />
      </button>

      <Sidebar
        isOpen={isOpen}
        onClose={closeMenu}
        title="My Account"
        side="right"
        id="profile-sidebar"
      >
        {/* Membership status — the one bit of content that's specific to
            this sidebar rather than being generic nav-list rendering */}
        <div className="rounded-md bg-orange-50 px-3 py-2 text-sm font-medium text-stone-600">
          Membership Status: {MEMBERSHIP_STATUS}
        </div>

        <NavList
          items={PROFILE_LINKS}
          onNavigate={closeMenu}
          className="mt-6 grid gap-1"
        />
      </Sidebar>
    </>
  );
}
