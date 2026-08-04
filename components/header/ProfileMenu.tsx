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
import { signOut, useSession } from "@/lib/auth-client";
import Sidebar from "../ui/Sidebar";
import NavList, { type NavListItem } from "../ui/NavList";
import { buttons } from "@/lib/styles";

// TODO: replace with real links as pages are created.
// Structure supports plain links (just a path) and collapsible parents (a subItems array instead of a path).
const PROFILE_LINKS: NavListItem[] = [
  { label: "Profile Information", path: "/profile" },
  { label: "Current Entries", path: "/profile/user-entries" },
  { label: "Purchase History", path: "/profile/purchase-history" },
  {
    label: "Sign Out",
    action: async () => {
      await signOut();
      window.location.href = "/";
    },
  },
];

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const user = session?.user as { role?: string | null; name?: string; email?: string; image?: string | null } | undefined;
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Member";

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Profile icon trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttons.iconButton}
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
          Membership Status: {roleLabel}
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
