"server-only";

import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import ConfirmForm from "@/components/ui/ConfirmForm";
import LogoUploader from "./LogoUploader";
import type { SponsorRow } from "./actions";
import {
  getAdminSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  updateSponsorVisibility,
  deleteSponsor,
} from "./actions";

// --- Sponsor Admin Page ---
// Server component gated by requireAdmin(). Fetches all sponsor rows
// and renders a form (create or edit) plus a data table. The form mode
// is driven by the ?edit=<id> search param: when absent, the form
// creates a new row; when present, it pre-fills from the matching
// record and submits to updateSponsor instead.
//
// Five form actions (create, update, toggle visibility, delete) each submit
// to their corresponding server action, which calls revalidatePath on
// success so the table stays fresh without client-side state management.

interface PageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminSponsorsPage({
  searchParams,
}: PageProps) {
  await requireAdmin();

  const { edit } = await searchParams;
  const editingId = edit ?? null;

  let rows: Awaited<ReturnType<typeof getAdminSponsors>>;
  let fetchError: string | null = null;

  try {
    rows = await getAdminSponsors();
  } catch (error: unknown) {
    rows = [];
    fetchError =
      error instanceof Error ? error.message : "Failed to load sponsors.";
  }

  // Resolve the row being edited (if any) to pre-populate form fields.
  let editingRow: SponsorRow | null = null;
  if (editingId) {
    editingRow = await getSponsorById(editingId);
  }

  const isEditing = editingId !== null && editingRow !== null;

  return (
    <div className="space-y-6 p-4 md:p-8 bg-stone-50 min-h-screen">
      {/* --- Page Header --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-950">Sponsors</h1>
          <p className="mt-1 text-sm text-stone-600">
            Manage sponsor logos, links, and visibility.
          </p>
        </div>
      </div>

      {/* --- Create / Edit Form --- */}
      <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-stone-950 mb-4">
          {isEditing ? "Edit Sponsor" : "New Sponsor"}
        </h2>

        <form
          action={isEditing ? updateSponsor : createSponsor}
          className="space-y-4"
        >
          {isEditing && (
            <input type="hidden" name="id" value={editingId} />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Name
              </label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editingRow?.name ?? ""}
                placeholder="Acme Corporation"
                className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm placeholder:text-stone-400 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              />
            </div>
            <LogoUploader key={editingId ?? "new"} defaultLogo={editingRow?.logo ?? ""} />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">
              Website URL
            </label>
            <input
              name="website"
              type="url"
              defaultValue={editingRow?.website ?? ""}
              placeholder="https://www.example.com"
              className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 shadow-sm placeholder:text-stone-400 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
              <input
                name="visible"
                type="checkbox"
                defaultChecked={editingRow?.visible ?? true}
                className="h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-600"
              />
              Visible on public site
            </label>

            <button
              type="submit"
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
            >
              {isEditing ? "Save Changes" : "Create Sponsor"}
            </button>

            {isEditing && (
              <Link
                href="/admin/sponsors"
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
            Could not load sponsors.
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
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-stone-950">
              No sponsors yet
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Use the form above to add your first sponsor.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-md border border-stone-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="hidden sm:table-header-group bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-600">
                  Website
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
                  className="block mb-6 border border-stone-200 p-4 rounded-md bg-white sm:table-row sm:mb-0 sm:border-0 sm:p-0 sm:border-b sm:border-stone-100 sm:hover:bg-stone-50/50"
                >
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-950">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-stone-500 mb-1">
                      Name
                    </span>
                    <div className="flex items-center gap-3">
                      {row.logo ? (
                        <img
                          src={row.logo}
                          alt=""
                          className="h-8 w-8 rounded object-contain"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-stone-100 flex items-center justify-center">
                          <span className="text-xs text-stone-400 font-medium">
                            {row.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {row.name}
                    </div>
                  </td>
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-stone-500 mb-1">
                      Website
                    </span>
                    {row.website ? (
                      <a
                        href={row.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-500 underline break-all"
                      >
                        {row.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-stone-500 mb-1">
                      Status
                    </span>
                    {row.visible ? (
                      <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700 border border-orange-200">
                        Visible
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700 border border-stone-200">
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="block mb-2 sm:table-cell sm:mb-0 px-6 py-4 whitespace-nowrap text-sm">
                    <span className="sm:hidden block text-xs font-semibold uppercase text-stone-500 mb-1">
                      Actions
                    </span>
                    <div className="flex items-center gap-2">
                      {/* --- Edit Link --- */}
                      <Link
                        href={`/admin/sponsors?edit=${row.id}`}
                        className="rounded-md bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-inset ring-stone-200 hover:bg-stone-200 transition-colors"
                      >
                        Edit
                      </Link>

                      {/* --- Show / Hide Toggle --- */}
                      <ConfirmForm
                        action={updateSponsorVisibility}
                        message={
                          row.visible
                            ? `Hide "${row.name}"? It will no longer appear on the public site.`
                            : `Show "${row.name}"? It will become visible on the public site.`
                        }
                      >
                        <input type="hidden" name="id" value={row.id} />
                        <input
                          type="hidden"
                          name="visible"
                          value={(!row.visible).toString()}
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-inset ring-stone-200 hover:bg-stone-200 transition-colors"
                        >
                          {row.visible ? "Hide" : "Show"}
                        </button>
                      </ConfirmForm>

                      {/* --- Delete --- */}
                      <ConfirmForm
                        action={deleteSponsor}
                        message={`Delete "${row.name}"? This action cannot be undone.`}
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