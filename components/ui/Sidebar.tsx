/**
 * Sidebar
 * -------
 * A generic slide-in overlay panel: portal + backdrop + a panel that slides
 * in from the left or right edge, with a title and a close (X) button.
 *
 * This component has no idea what's inside it — it just renders whatever
 * `children` it's given. That's what lets ProfileMenu slot in an extra
 * "Membership Status" block above its <NavList>, while MobileNav renders
 * just the <NavList> alone.
 *
 * Used by:
 * - components/header/MobileNav.tsx   (side="left")
 * - components/header/ProfileMenu.tsx (side="right")
 */
"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { buttons } from "@/lib/styles";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // Which edge the panel slides in from. Defaults to "right" (e.g. profile menu).
  side?: "left" | "right";
  // Used for aria-controls on the trigger button that opens this sidebar.
  id?: string;
  children: React.ReactNode;
}

export default function Sidebar({
  isOpen,
  onClose,
  title,
  side = "right",
  id = "sidebar-panel",
  children,
}: SidebarProps) {
  // document.body doesn't exist during server rendering, so only create the
  // portal once the component has mounted in the browser.
  const mounted = useSyncExternalStore(
    () => () => {}, // no-op subscribe — nothing to unsubscribe from
    () => true, // client snapshot — we're mounted
    () => false, // server snapshot — we're not mounted
  );

  if (!mounted) return null;

  const isLeft = side === "left";

  return createPortal(
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
        onClick={onClose}
        aria-label={`Close ${title.toLowerCase()} overlay`}
        className={`absolute inset-0 bg-stone-950/45 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar panel */}
      <aside
        id={id}
        className={[
          "absolute top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-surface p-5 shadow-lg transition-transform duration-300",
          isLeft ? "left-0" : "right-0",
          isOpen
            ? "translate-x-0"
            : isLeft
              ? "-translate-x-full"
              : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-heading">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className={buttons.iconButton}
            aria-label={`Close ${title.toLowerCase()}`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </aside>
    </div>,
    document.body,
  );
}
