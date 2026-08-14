/**
 * ConfirmDialog
 * -------------
 * Reusable "are you sure?" modal. Generalized so any part of the site can
 * ask for confirmation before a destructive or important action.
 *
 * Usage:
 *   const [showConfirm, setShowConfirm] = useState(false);
 *
 *   <ConfirmDialog
 *     open={showConfirm}
 *     icon={LogOut}
 *     title="Sign out?"
 *     message="Are you sure you want to sign out of your CCRA account? You can always sign back in later."
 *     confirmLabel="Sign Out"
 *     onConfirm={handleSignOut}
 *     onClose={() => setShowConfirm(false)}
 *   />
 *
 * The component doesn't manage its own open/closed state — the parent owns
 * that (via `open`). This keeps it easy to pass per-item context (e.g. which
 * entry is being removed) into `onConfirm` via a closure.
 */
"use client";

import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

export interface ConfirmDialogProps {
  /** Controls whether the dialog is rendered at all. */
  open: boolean;
  /** Icon shown in the colored circle at the top of the dialog. */
  icon: LucideIcon;
  /** Dialog heading, e.g. "Sign out?" or "Remove entry?". */
  title: string;
  /** Body copy explaining what's about to happen. */
  message: string;
  /** Label for the confirm button. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Called when the user confirms. The dialog does NOT auto-close itself
   *  after this runs — call onClose from within onConfirm (or after it)
   *  if you want it to close, same as the original sign-out flow. */
  onConfirm: () => void;
  /** Called when the user cancels, clicks the backdrop, or hits the X. */
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  icon: Icon,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay-blur backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-md border border-border bg-surface p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-body-text transition hover:bg-highlight"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-md bg-danger flex items-center justify-center text-danger-text">
            <Icon className="w-5 h-5" />
          </div>

          <h3 className="text-lg font-semibold text-heading-text">
            {title}
          </h3>
        </div>

        <p className="text-sm text-body-text mb-6">{message}</p>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-heading-text transition hover:bg-highlight"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-md bg-danger px-4 py-2.5 text-sm font-semibold text-danger-text transition hover:bg-danger-dark"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}