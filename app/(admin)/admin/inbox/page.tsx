import "server-only";

import { requireAdmin } from "@/lib/admin-auth";
import { getContactSubmissions, getRodeoApprovals } from "@/lib/gateway-client";
import { GatewayError } from "@/lib/gateway";
import type { ContactSubmission, RodeoApproval } from "@/lib/gateway-client";
import { InboxTabs } from "./InboxTabs";

// ---------------------------------------------------------------------------
// Data fetching — runs server-side, fails gracefully so a single broken
// endpoint doesn't take down the whole page.
// ---------------------------------------------------------------------------

async function fetchSubmissions(): Promise<{
  contacts: ContactSubmission[];
  approvals: RodeoApproval[];
  errors: string[];
}> {
  const [contactsResult, approvalsResult] = await Promise.allSettled([
    getContactSubmissions(),
    getRodeoApprovals(),
  ]);

  const errors: string[] = [];
  const contacts: ContactSubmission[] =
    contactsResult.status === "fulfilled" ? contactsResult.value : [];
  const approvals: RodeoApproval[] =
    approvalsResult.status === "fulfilled" ? approvalsResult.value : [];

  if (contactsResult.status === "rejected") {
    const msg =
      contactsResult.reason instanceof GatewayError
        ? contactsResult.reason.message
        : "Failed to load contact submissions.";
    errors.push(msg);
  }
  if (approvalsResult.status === "rejected") {
    const msg =
      approvalsResult.reason instanceof GatewayError
        ? approvalsResult.reason.message
        : "Failed to load rodeo approvals.";
    errors.push(msg);
  }

  return { contacts, approvals, errors };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AdminInboxPage() {
  await requireAdmin();

  const { contacts, approvals, errors } = await fetchSubmissions();

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-heading-text">
            Inbox
          </h1>
          <p className="mt-1 text-sm text-body-text">
            Contact submissions and rodeo approval requests.
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 space-y-2">
          {errors.map((err, i) => (
            <div
              key={i}
              className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
              role="alert"
            >
              {err}
            </div>
          ))}
        </div>
      )}

      <InboxTabs contacts={contacts} approvals={approvals} />
    </div>
  );
}