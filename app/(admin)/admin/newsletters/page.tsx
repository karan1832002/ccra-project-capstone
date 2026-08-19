import "server-only";

import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import ConfirmForm from "@/components/ui/ConfirmForm";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import type { NewsletterRow } from "./actions";
import {
  getAdminNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  updateNewsletterStatus,
  deleteNewsletter,
} from "./actions";

// --- Newsletter Admin Page ---
// Server component gated by requireAdmin(). Fetches all newsletter rows
// and renders a form (create or edit) plus a data table. The form mode
// is driven by the ?edit=<id> search param: when absent, the form
// creates a new row; when present, it pre-fills from the matching
// record and submits to updateNewsletter instead.
//
// Four form actions (create, update, toggle publish, delete) each submit
// to their corresponding server action, which calls revalidatePath on
// success so the table stays fresh without client-side state management.

interface PageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminNewslettersPage({
  searchParams,
}: PageProps) {
  await requireAdmin();

  const { edit } = await searchParams;
  const editingId = edit ?? null;

  let rows: Awaited<ReturnType<typeof getAdminNewsletters>>;
  let fetchError: string | null = null;

  try {
    rows = await getAdminNewsletters();
  } catch (error: unknown) {
    rows = [];
    fetchError =
      error instanceof Error ? error.message : "Failed to load newsletters.";
  }

  // Resolve the row being edited (if any) to pre-populate form fields.
  let editingRow: NewsletterRow | null = null;
  if (editingId) {
    editingRow = await getNewsletterById(editingId);
  }

  const isEditing = editingId !== null && editingRow !== null;

  return (
    <div className="space-y-6 p-4 md:p-8 bg-background min-h-screen">
      {/* --- Page Header --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-heading-text">Newsletters</h1>
          <p className="mt-1 text-sm text-body-text">
            Create, publish, and manage newsletter editions.
          </p>
        </div>
      </div>

      {/* --- Create / Edit Form --- */}
      <div className="rounded-md border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-base font-semibold text-heading-text mb-4">
          {isEditing ? "Edit Newsletter" : "New Newsletter"}
        </h2>

        <form
          action={isEditing ? updateNewsletter : createNewsletter}
          className="space-y-4"
        >
          {isEditing && (
            <input type="hidden" name="id" value={editingId} />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-body-text">
                Title
              </label>
              <input
                name="title"
                type="text"
                required
                defaultValue={editingRow?.title ?? ""}
                placeholder="Monthly Update"
                className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading-text shadow-sm placeholder:text-caption-text focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-body-text">
                Date
              </label>
              <input
                name="date"
                type="text"
                required
                defaultValue={editingRow?.date ?? ""}
                placeholder="August 2026"
                className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading-text shadow-sm placeholder:text-caption-text focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-body-text">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={2}
              defaultValue={editingRow?.description ?? ""}
              placeholder="Brief summary shown on cards and listings..."
              className="mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading-text shadow-sm placeholder:text-caption-text focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-body-text mb-2">
              Content
              <span className="ml-1 text-xs font-normal text-caption-text">
                (Markdown supported)
              </span>
            </label>
            {/* key forces remount when switching between edit rows, syncing the internal useState */}
            <MarkdownEditor
              key={editingId ?? "new"}
              name="content"
              defaultValue={editingRow?.content ?? ""}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-body-text cursor-pointer">
              <input
                name="published"
                type="checkbox"
                defaultChecked={editingRow?.published ?? false}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Publish immediately
            </label>

            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-text shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isEditing ? "Save Changes" : "Create Newsletter"}
            </button>

            {isEditing && (
              <Link
                href="/admin/newsletters"
                className="rounded-md bg-highlight px-4 py-2 text-sm font-semibold text-body-text ring-1 ring-inset ring-border hover:bg-accent transition-colors"
              >
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* --- Data Table --- */}
      {fetchError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/40">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            Could not load newsletters.
          </p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fetchError}</p>
        </div>
      ) : rows.length === 0 ? (
        /* --- Empty State --- */
        <div className="rounded-md border border-border bg-surface shadow-sm">
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-highlight">
              <svg
                className="h-6 w-6 text-body-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-heading-text">
              No newsletters yet
            </h3>
            <p className="mt-1 text-sm text-body-text">
              Use the form above to create your first newsletter edition.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-md border border-border bg-surface shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="hidden sm:table-header-group bg-highlight">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-caption-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="block mb-6 border border-border p-4 rounded-md bg-surface sm:table-row sm:mb-0 sm:border-0 sm:p-0 sm:border-b sm:border-border sm:hover:bg-highlight"
                >
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm text-body-text">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                      Date
                    </span>
                    {row.date}
                  </td>
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm font-medium text-heading-text">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                      Title
                    </span>
                    {row.title}
                  </td>
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                      Status
                    </span>
                    {row.published ? (
                      <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-text border border-border">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-highlight px-2.5 py-0.5 text-xs font-medium text-body-text border border-border">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-caption-text mb-1">
                      Actions
                    </span>
                    <div className="flex items-center gap-2">
                      {/* --- Edit Link --- */}
                      <Link
                        href={`/admin/newsletters?edit=${row.id}`}
                        className="rounded-md bg-highlight px-3 py-1 text-xs font-semibold text-body-text ring-1 ring-inset ring-border hover:bg-accent transition-colors"
                      >
                        Edit
                      </Link>

                      {/* --- Publish / Unpublish Toggle --- */}
                      <ConfirmForm
                        action={updateNewsletterStatus}
                        message={
                          row.published
                            ? `Unpublish "${row.title}"? It will no longer appear on the public site.`
                            : `Publish "${row.title}"? It will become visible on the public site.`
                        }
                      >
                        <input type="hidden" name="id" value={row.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={(!row.published).toString()}
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-highlight px-3 py-1 text-xs font-semibold text-body-text ring-1 ring-inset ring-border hover:bg-accent transition-colors"
                        >
                          {row.published ? "Unpublish" : "Publish"}
                        </button>
                      </ConfirmForm>

                      {/* --- Delete --- */}
                      <ConfirmForm
                        action={deleteNewsletter}
                        message={`Delete "${row.title}"? This action cannot be undone.`}
                      >
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="rounded-md bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100 transition-colors dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800 dark:hover:bg-red-900/40"
                        >
                          Delete
                        </button>
                      </ConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}