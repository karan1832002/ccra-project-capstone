"use client";

import { useState, useTransition } from "react";
import { X, Mail, Phone, MapPin, FileText, Calendar, User as UserIcon, DollarSign } from "lucide-react";
import type { ContactSubmission, RodeoApproval } from "@/lib/gateway-client";
import { markContactStatus, markApprovalStatus } from "./actions";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

type Tab = "contacts" | "approvals";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    unread:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    read: "bg-disabled text-disabled-text",
    archived:
      "bg-disabled text-disabled-text",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    rejected:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        colors[status] ?? "bg-disabled text-disabled-text"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-caption-text uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-heading-text whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slide-over drawer
// ---------------------------------------------------------------------------

type DrawerState<T> = {
  open: boolean;
  item: T | null;
};

// ---- Contact detail drawer ----

function ContactDrawer({
  state,
  onClose,
}: {
  state: DrawerState<ContactSubmission>;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState("");

  if (!state.open || !state.item) return null;
  const c = state.item;

  function applyStatus(status: string) {
    startTransition(async () => {
      const result = await markContactStatus(c.id, status);
      setFeedback(result.message);
      if (result.success) {
        // Optimistically update the local item
        c.status = status;
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      {/* Drawer panel */}
      <div className="relative ml-auto w-full max-w-lg bg-surface shadow-xl overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <h3 className="text-lg font-semibold text-heading-text">
            Contact Submission
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-caption-text hover:bg-highlight hover:text-body-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Meta row */}
          <div className="flex items-center gap-3">
            <StatusBadge status={c.status} />
            <span className="text-xs text-caption-text">{formatDate(c.createdAt)}</span>
          </div>

          {/* Identity */}
          <dl className="space-y-4">
            <DetailField label="Full Name" value={`${c.firstName} ${c.lastName}`} />
            <div>
              <dt className="text-xs font-medium text-caption-text uppercase tracking-wider mb-1">Email</dt>
              <dd className="text-sm text-heading-text flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-caption-text" />
                <a href={`mailto:${c.email}`} className="text-accent-text hover:underline">{c.email}</a>
              </dd>
            </div>
            {c.phone && (
              <div>
                <dt className="text-xs font-medium text-caption-text uppercase tracking-wider mb-1">Phone</dt>
                <dd className="text-sm text-heading-text flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-caption-text" />
                  <a href={`tel:${c.phone}`} className="text-accent-text hover:underline">{c.phone}</a>
                </dd>
              </div>
            )}
            <DetailField label="Message" value={c.message} />
          </dl>

          {/* Actions */}
          <div className="border-t border-border pt-5 space-y-3">
            {feedback && (
              <p className="text-xs text-body-text bg-highlight rounded-md px-3 py-2">
                {feedback}
              </p>
            )}
            {c.status === "unread" && (
              <button
                onClick={() => applyStatus("read")}
                disabled={pending}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-text hover:bg-primary-dark disabled:opacity-60 transition"
              >
                Mark as Read
              </button>
            )}
            {(c.status === "unread" || c.status === "read") && (
              <button
                onClick={() => applyStatus("archived")}
                disabled={pending}
                className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-body-text hover:bg-highlight disabled:opacity-60 transition"
              >
                Archive
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Rodeo approval detail drawer ----

function ApprovalDrawer({
  state,
  onClose,
}: {
  state: DrawerState<RodeoApproval>;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState("");

  if (!state.open || !state.item) return null;
  const a = state.item;

  function applyStatus(status: string) {
    startTransition(async () => {
      const result = await markApprovalStatus(a.id, status);
      setFeedback(result.message);
      if (result.success) {
        a.status = status;
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-surface shadow-xl overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <h3 className="text-lg font-semibold text-heading-text">
            {a.rodeoName}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-caption-text hover:bg-highlight hover:text-body-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex items-center gap-3">
            <StatusBadge status={a.status} />
            <span className="text-xs text-caption-text">{formatDate(a.createdAt)}</span>
          </div>

          <dl className="space-y-4">
            <DetailField label="Rodeo Name" value={a.rodeoName} />
            <DetailField label="Rodeo Type" value={a.rodeoType} />
            <DetailField label="Location" value={a.location} />
            <DetailField label="Arena Type" value={a.arenaType} />
            <DetailField label="Committee Name" value={a.committeeName} />
            <DetailField label="Primary Contact" value={a.primaryContact} />
            <div>
              <dt className="text-xs font-medium text-caption-text uppercase tracking-wider mb-1">Email</dt>
              <dd className="text-sm text-heading-text flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-caption-text" />
                <a href={`mailto:${a.email}`} className="text-accent-text hover:underline">{a.email}</a>
              </dd>
            </div>
            <DetailField label="Phone" value={a.phone} />
            <DetailField label="Mailing Address" value={a.mailingAddress} />
            <DetailField label="Directions" value={a.directions} />
            <DetailField label="Schedule Details" value={a.scheduleDetails} />
            <DetailField label="Order of Events" value={a.orderOfEvents} />
            <DetailField label="Stock Contractor" value={a.stockContractor} />
            <DetailField label="Judges" value={a.judges} />
            <DetailField label="Electrical" value={a.electrical} />
            <DetailField label="Stalls" value={a.stalls} />
            <DetailField label="Self-Penning" value={a.selfPenning} />
            <DetailField label="Stall/Camping Contact" value={a.stallContact} />
            <DetailField label="Medical Provider" value={a.medicalProvider} />
            <DetailField label="Association Fees" value={a.associationFees} />
            <DetailField label="Signature" value={a.signature} />
            <DetailField label="Date Signed" value={a.dateSigned} />
            <DetailField label="Payment Method" value={a.payment} />
            {a.message && <DetailField label="Notes" value={a.message} />}
          </dl>

          {/* Added money display */}
          {a.addedMoney && Object.keys(a.addedMoney).length > 0 && (
            <div>
              <dt className="text-xs font-medium text-caption-text uppercase tracking-wider mb-2">
                Added Money
              </dt>
              <dd>
                <table className="w-full text-sm border border-border rounded-md">
                  <tbody className="divide-y divide-border">
                    {Object.entries(a.addedMoney).map(([event, amount]) => (
                      <tr key={event}>
                        <td className="px-3 py-2 text-body-text">
                          {event.replace("addedMoney_", "")}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-heading-text">
                          ${amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </dd>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-border pt-5 space-y-3">
            {feedback && (
              <p className="text-xs text-body-text bg-highlight rounded-md px-3 py-2">
                {feedback}
              </p>
            )}
            {a.status === "pending" && (
              <>
                <button
                  onClick={() => applyStatus("approved")}
                  disabled={pending}
                  className="w-full rounded-md bg-success px-4 py-2 text-sm font-medium text-success-text hover:bg-success-dark disabled:opacity-60 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => applyStatus("rejected")}
                  disabled={pending}
                  className="w-full rounded-md border border-red-300 bg-surface px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 transition dark:border-red-800 dark:bg-surface dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tables with clickable rows
// ---------------------------------------------------------------------------

function ContactsTable({
  contacts,
  onSelect,
}: {
  contacts: ContactSubmission[];
  onSelect: (item: ContactSubmission) => void;
}) {
  if (contacts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-body-text">
        No contact submissions yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Email
            </th>
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {contacts.map((c) => (
            <tr
              key={c.id}
              onClick={() => onSelect(c)}
              className="hover:bg-highlight transition-colors cursor-pointer"
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(c);
              }}
            >
              <td className="px-4 py-3 font-medium text-heading-text">
                {c.firstName} {c.lastName}
              </td>
              <td className="px-4 py-3 text-body-text">
                {c.email}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3 text-caption-text">
                {formatDate(c.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApprovalsTable({
  approvals,
  onSelect,
}: {
  approvals: RodeoApproval[];
  onSelect: (item: RodeoApproval) => void;
}) {
  if (approvals.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-body-text">
        No rodeo approval requests yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Rodeo Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Committee
            </th>
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Contact
            </th>
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-body-text">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {approvals.map((a) => (
            <tr
              key={a.id}
              onClick={() => onSelect(a)}
              className="hover:bg-highlight transition-colors cursor-pointer"
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(a);
              }}
            >
              <td className="px-4 py-3 font-medium text-heading-text">
                {a.rodeoName}
              </td>
              <td className="px-4 py-3 text-body-text">
                {a.committeeName}
              </td>
              <td className="px-4 py-3 text-body-text">
                {a.primaryContact}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-4 py-3 text-caption-text">
                {formatDate(a.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs container
// ---------------------------------------------------------------------------

const tabs: { key: Tab; label: string }[] = [
  { key: "contacts", label: "Contact Submissions" },
  { key: "approvals", label: "Rodeo Approvals" },
];

export function InboxTabs({
  contacts,
  approvals,
}: {
  contacts: ContactSubmission[];
  approvals: RodeoApproval[];
}) {
  const [active, setActive] = useState<Tab>("contacts");
  const [contactDrawer, setContactDrawer] = useState<DrawerState<ContactSubmission>>({ open: false, item: null });
  const [approvalDrawer, setApprovalDrawer] = useState<DrawerState<RodeoApproval>>({ open: false, item: null });

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg bg-highlight p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              active === tab.key
                ? "bg-surface text-heading-text shadow-sm"
                : "text-body-text hover:text-heading-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6 rounded-lg border border-border bg-surface">
        {active === "contacts" ? (
          <ContactsTable
            contacts={contacts}
            onSelect={(item) => setContactDrawer({ open: true, item })}
          />
        ) : (
          <ApprovalsTable
            approvals={approvals}
            onSelect={(item) => setApprovalDrawer({ open: true, item })}
          />
        )}
      </div>

      {/* Drawers */}
      <ContactDrawer
        state={contactDrawer}
        onClose={() => setContactDrawer({ open: false, item: null })}
      />
      <ApprovalDrawer
        state={approvalDrawer}
        onClose={() => setApprovalDrawer({ open: false, item: null })}
      />
    </div>
  );
}