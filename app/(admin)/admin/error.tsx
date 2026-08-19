"use client";

import { useEffect } from "react";

// Error boundary for the admin segment. Catches errors thrown by server
// components (e.g. a gateway timeout from callGateway) and offers a retry
// instead of leaving the page stuck.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6 md:p-8">
      <div className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/40">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          Something went wrong loading this page.
        </p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-text hover:bg-primary-dark"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
