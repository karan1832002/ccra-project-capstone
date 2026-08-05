/**
 * MobileNav
 * ---------
 * The hamburger button + slide-in nav drawer shown once the screen is too
 * narrow for the desktop DropdownMenu row (see Header.tsx: hamburger is
 * `lg:hidden`, desktop nav is `hidden lg:flex`).
 *
 * This is just glue: Sidebar provides the overlay/panel chrome, NavList
 * renders the actual links. All the "which item is expanded" state lives
 * inside NavList, not here.
 */
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../ui/Sidebar";
import NavList from "../ui/NavList";
import type { NavItem } from "./Header";
import { buttons } from "@/lib/styles";

export interface MobileNavProps {
  items: NavItem[];
}

export default function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      {/* Hamburger trigger — only rendered/visible below the lg breakpoint */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${buttons.iconButton} lg:hidden`}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="nav-sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar
        isOpen={isOpen}
        onClose={closeMenu}
        title="Menu"
        side="left"
        id="nav-sidebar"
      >
        <NavList items={items} onNavigate={closeMenu} />
      </Sidebar>
    </>
  );
}
