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
    <div className="space-y-6 p-8 bg-stone-50 min-h-screen">
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-2xl font-bold text-stone-950">Newsletters</h1>
        <p className="mt-1 text-sm text-stone-600">
          Create, publish, and manage newsletter editions.
        </p>
      </div>

      {/* --- Create / Edit Form --- */}
      <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-stone-950 mb-4">
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
              <label className="block text-sm font-medium text-stone-700">
                Title
              </label>
              <input
                name="title"
                type="text"
                required
                defaultValue={editingRow?.title ?? ""}
                placeholder="Monthly Update"
                className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm placeholder:text-stone-400 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Date
              </label>
              <input
                name="date"
                type="text"
                required
                defaultValue={editingRow?.date ?? ""}
                placeholder="August 2026"
                className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm placeholder:text-stone-400 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={2}
              defaultValue={editingRow?.description ?? ""}
              placeholder="Brief summary shown on cards and listings..."
              className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm placeholder:text-stone-400 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Content
              <span className="ml-1 text-xs font-normal text-stone-400">
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
            <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
              <input
                name="published"
                type="checkbox"
                defaultChecked={editingRow?.published ?? false}
                className="h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-600"
              />
              Publish immediately
            </label>

            <button
              type="submit"
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
            >
              {isEditing ? "Save Changes" : "Create Newsletter"}
            </button>

            {isEditing && (
              <Link
                href="/admin/newsletters"
                className="rounded-md bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 ring-1 ring-inset ring-stone-200 hover:bg-stone-200 transition-colors"
              >
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* --- Data Table --- */}
      {fetchError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-800">
            Could not load newsletters.
          </p>
          <p className="mt-1 text-sm text-red-600">{fetchError}</p>
        </div>
      ) : rows.length === 0 ? (
        /* --- Empty State --- */
        <div className="rounded-md border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
              <svg
                className="h-6 w-6 text-stone-400"
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
            <h3 className="text-sm font-semibold text-stone-950">
              No newsletters yet
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Use the form above to create your first newsletter edition.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-stone-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-600">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-600">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-stone-100 bg-white transition-colors hover:bg-stone-50/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-950">
                    {row.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row.published ? (
                      <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 border border-orange-200">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700 border border-stone-200">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {/* --- Edit Link --- */}
                      <Link
                        href={`/admin/newsletters?edit=${row.id}`}
                        className="rounded-md bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-inset ring-stone-200 hover:bg-stone-200 transition-colors"
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
                          className="rounded-md bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-inset ring-stone-200 hover:bg-stone-200 transition-colors"
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
                          className="rounded-md bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100 transition-colors"
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