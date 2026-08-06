"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X, ExternalLink } from "lucide-react";
import type { MinuteEntry, MinuteEntryData } from "@/lib/gateway-client";
import { createMinuteAction, updateMinuteAction, deleteMinuteAction } from "./actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Minute form modal (shared for create and edit)
// ---------------------------------------------------------------------------

type FormState = {
  title: string;
  meetingDate: string;
  location: string;
  summary: string;
  googleDocUrl: string;
};

const emptyForm: FormState = {
  title: "",
  meetingDate: "",
  location: "",
  summary: "",
  googleDocUrl: "",
};

function MinuteFormModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: MinuteEntry;
  onClose: () => void;
  onSave: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);

  // Re-seed form whenever the modal opens — useState initializer only runs on
  // first mount, but this component stays mounted and returns null when closed.
  useEffect(() => {
    if (!open) return;
    setForm(
      initial
        ? {
            title: initial.title,
            meetingDate: initial.meetingDate.slice(0, 10),
            location: initial.location ?? "",
            summary: initial.summary,
            googleDocUrl: initial.googleDocUrl ?? "",
          }
        : emptyForm,
    );
  }, [open, initial]);

  if (!open) return null;

  const isEdit = !!initial;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: MinuteEntryData = {
      title: form.title,
      meetingDate: form.meetingDate,
      location: form.location || undefined,
      summary: form.summary,
      googleDocUrl: form.googleDocUrl || undefined,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateMinuteAction(initial!.id, payload)
        : await createMinuteAction(payload);
      setFeedback(result.message);
      if (result.success) {
        onSave();
        onClose();
        if (!isEdit) setForm(emptyForm);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-900 shadow-xl mx-4">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEdit ? "Edit Minute" : "New Minute"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="m-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              id="m-title"
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="m-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <input
              id="m-date"
              type="date"
              required
              value={form.meetingDate}
              onChange={(e) => setForm((p) => ({ ...p, meetingDate: e.target.value }))}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="m-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              id="m-location"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder="e.g. Strathmore, AB"
            />
          </div>

          <div>
            <label htmlFor="m-summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Summary *
            </label>
            <textarea
              id="m-summary"
              required
              rows={3}
              value={form.summary}
              onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 resize-y"
            />
          </div>

          <div>
            <label htmlFor="m-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Google Doc URL
            </label>
            <input
              id="m-url"
              type="url"
              value={form.googleDocUrl}
              onChange={(e) => setForm((p) => ({ ...p, googleDocUrl: e.target.value }))}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder="https://docs.google.com/document/d/..."
            />
          </div>

          {feedback && (
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2">
              {feedback}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60 transition"
            >
              {pending ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main manager component
// ---------------------------------------------------------------------------

export default function MinutesManager({ minutes: initialMinutes }: { minutes: MinuteEntry[] }) {
  const router = useRouter();
  const [minutes, setMinutes] = useState(initialMinutes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MinuteEntry | undefined>(undefined);
  const [pendingDelete, startDeleteTransition] = useTransition();

  // Sync local state when the server-revalidated prop changes.
  useEffect(() => {
    setMinutes(initialMinutes);
  }, [initialMinutes]);

  function handleEdit(minute: MinuteEntry) {
    setEditing(minute);
    setModalOpen(true);
  }

  function handleNew() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this minute?")) return;
    startDeleteTransition(async () => {
      const result = await deleteMinuteAction(id);
      if (result.success) {
        setMinutes((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(result.message);
      }
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-950 dark:text-stone-100">Meeting Minutes</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Manage published board meeting records.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition"
        >
          <Plus className="w-4 h-4" />
          New Minute
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Location</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {minutes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-stone-500">
                  No minutes published yet.
                </td>
              </tr>
            )}
            {minutes.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {m.title}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(m.meetingDate)}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{m.location ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    {m.googleDocUrl && (
                      <a
                        href={m.googleDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                        title="Open Google Doc"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(m)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={pendingDelete}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 disabled:opacity-40"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MinuteFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={() => {
          router.refresh();
        }}
      />
    </>
  );
}