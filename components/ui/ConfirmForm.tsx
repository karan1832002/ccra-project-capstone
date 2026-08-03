"use client";

import { type ReactNode, useCallback } from "react";

// --- Confirm Form ---
// Client wrapper around a <form action={serverAction}>.
// Intercepts the submit event and calls window.confirm() with the
// provided message. Submission only proceeds if the user confirms.
// This keeps the existing server-action pattern intact while adding
// a guard against accidental destructive actions.

interface ConfirmFormProps {
  action: (formData: FormData) => void;
  message: string;
  children: ReactNode;
}

export default function ConfirmForm({
  action,
  message,
  children,
}: ConfirmFormProps) {
  const handleSubmit = useCallback(
    (formData: FormData) => {
      if (window.confirm(message)) {
        action(formData);
      }
    },
    [action, message],
  );

  return <form action={handleSubmit}>{children}</form>;
}