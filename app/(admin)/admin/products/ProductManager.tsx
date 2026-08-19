"use client";

import { useRef, useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  EyeOff,
  RotateCcw,
  X,
  Loader2,
  PackageX,
  Upload,
  ImageOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  createProduct,
  updateProduct,
  deactivateProduct,
  restoreProduct,
  deleteProductPermanently,
  type AdminProduct,
  type ProductInput,
} from "./actions";

// Blank form state for the "Add product" case.
const EMPTY_FORM = {
  name: "",
  description: "",
  price: "", // dollars in the input, converted to cents on submit
  image: "",
  category: "",
  stock: "0",
};

type FormState = typeof EMPTY_FORM;

// Standard store categories offered in the dropdown. Any category already in
// the data but missing here is merged in at render time, so existing products
// never lose their category just because it isn't on this list.
// Rows per page. Client-side: the admin list is small enough to fetch in one
// go, this just keeps the table from becoming an endless scroll.
const PAGE_SIZE = 20;

const CATEGORY_OPTIONS = [
  // Apparel
  "T-Shirt",
  "Shirt",
  "Hoodie",
  "Jacket",
  "Vest",
  "Pants",
  "Jeans",
  "Shorts",
  // Headwear & footwear
  "Cap",
  "Hat",
  "Boots",
  // Gear & accessories
  "Belt",
  "Buckle",
  "Gloves",
  "Bag",
  "Accessories",
  "Equipment",
  // Other
  "Gifts",
  "Souvenirs",
];

export default function ProductManager({ products }: { products: AdminProduct[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Which product is awaiting confirmation, and for what action.
  const [confirmTarget, setConfirmTarget] = useState<{
    product: AdminProduct;
    action: "delete" | "hide";
  } | null>(null);
  const [tableError, setTableError] = useState("");
  const [page, setPage] = useState(1);

  // Upload the chosen file to media-service and use the returned blob URL as
  // this product's image. Same endpoint the admin gallery uses.
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("category", "product_image");

      const res = await fetch("/api/media", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.blobUrl) {
        throw new Error(json?.error?.message ?? json?.error ?? "Upload failed");
      }
      setForm((f) => ({ ...f, image: json.data.blobUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // allow re-picking the same file
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEdit(p: AdminProduct) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: (p.priceCents / 100).toFixed(2),
      image: p.image ?? "",
      category: p.category ?? "",
      stock: String(p.stock),
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const priceCents = Math.round(parseFloat(form.price) * 100);
    const stock = parseInt(form.stock, 10);

    if (!form.name.trim()) return setError("Name is required.");
    if (!Number.isFinite(priceCents) || priceCents <= 0)
      return setError("Enter a price greater than 0.");
    if (!Number.isInteger(stock) || stock < 0) return setError("Stock must be 0 or more.");

    // Only send optional fields when filled — the backend validates image as a URL.
    const payload: ProductInput = {
      name: form.name.trim(),
      priceCents,
      stock,
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
      ...(form.image.trim() ? { image: form.image.trim() } : {}),
      ...(form.category.trim() ? { category: form.category.trim() } : {}),
    };

    startTransition(async () => {
      try {
        if (editing) await updateProduct(editing.id, payload);
        else await createProduct(payload);
        setShowForm(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save the product.");
      }
    });
  }

  // Destructive actions open the in-app confirm dialog instead of window.confirm.
  function handleDelete(p: AdminProduct) {
    setConfirmTarget({ product: p, action: "delete" });
  }

  // Hiding asks first; restoring is harmless so it runs immediately.
  function handleToggleActive(p: AdminProduct) {
    if (p.active) setConfirmTarget({ product: p, action: "hide" });
    else runAction(p, "restore");
  }

  // Performs whichever action the admin confirmed. Errors surface in a banner
  // above the table rather than a browser alert.
  function runAction(p: AdminProduct, action: "delete" | "hide" | "restore") {
    setConfirmTarget(null);
    setTableError("");
    setBusyId(p.id);
    startTransition(async () => {
      try {
        if (action === "delete") await deleteProductPermanently(p.id);
        else if (action === "hide") await deactivateProduct(p.id);
        else await restoreProduct(p.id);
      } catch (err) {
        setTableError(err instanceof Error ? err.message : "Could not update the product.");
      } finally {
        setBusyId(null);
      }
    });
  }

  const inputCls =
    "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-heading-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  // Dropdown options: the standard list plus any category already saved on a
  // product (so editing an old product doesn't silently blank its category).
  const categoryOptions = Array.from(
    new Set([...CATEGORY_OPTIONS, ...products.map((p) => p.category).filter(Boolean)]),
  ).sort() as string[];

  // Clamp the page so it stays valid when the list shrinks (e.g. after a delete).
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paged = products.slice(start, start + PAGE_SIZE);

  // Typing filters the list to categories starting with what's typed; an empty
  // box shows everything. Free text is allowed, so a new category can be added
  // by just typing it.
  const categoryMatches = form.category.trim()
    ? categoryOptions.filter((c) => c.toLowerCase().startsWith(form.category.trim().toLowerCase()))
    : categoryOptions;

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-heading-text">Products</h1>
          <p className="mt-1 text-sm text-body-text">Manage store products and inventory.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-text transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {tableError && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          <span>{tableError}</span>
          <button
            onClick={() => setTableError("")}
            className="shrink-0 rounded p-0.5 text-red-400 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 dark:hover:text-red-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-16 text-center">
          <PackageX className="mx-auto mb-3 h-10 w-10 text-caption-text" />
          <p className="text-body-text">No products yet. Add your first one.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-highlight text-left text-xs uppercase tracking-wide text-caption-text">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3 text-right font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((p) => (
                  <tr key={p.id} className={p.active ? "" : "bg-highlight"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-highlight">
                          {p.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-heading-text">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-text">{p.category ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-heading-text">
                      ${(p.priceCents / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={p.stock === 0 ? "font-semibold text-danger" : "text-heading-text"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.active ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-disabled px-2 py-0.5 text-xs font-medium text-disabled-text">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-md p-2 text-body-text transition hover:bg-highlight hover:text-heading-text"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(p)}
                          disabled={busyId === p.id}
                          className="rounded-md p-2 text-body-text transition hover:bg-highlight hover:text-heading-text disabled:opacity-50"
                          title={p.active ? "Hide from store" : "Restore to store"}
                        >
                          {busyId === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : p.active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={busyId === p.id}
                          className="rounded-md p-2 text-body-text transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          title="Delete permanently (only if never ordered)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination — only shown once the list outgrows a single page */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border bg-highlight px-4 py-3">
              <p className="text-xs text-body-text">
                Showing <span className="font-medium text-body-text">{start + 1}</span>–
                <span className="font-medium text-body-text">
                  {Math.min(start + PAGE_SIZE, products.length)}
                </span>{" "}
                of <span className="font-medium text-body-text">{products.length}</span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-body-text transition hover:bg-highlight disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>

                <span className="px-3 text-xs text-body-text">
                  Page {safePage} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-body-text transition hover:bg-highlight disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-heading-text">
                {editing ? "Edit product" : "Add product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md p-1.5 text-body-text transition hover:bg-highlight hover:text-heading-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-body-text">Name</label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="CCRA Official Cap"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-body-text">Description</label>
                <textarea
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Embroidered logo, adjustable strap."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-body-text">Price (CAD)</label>
                  <input
                    className={inputCls}
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-body-text">Stock</label>
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-body-text">Category</label>
                <div className="relative">
                  <input
                    className={inputCls}
                    value={form.category}
                    onChange={(e) => {
                      setForm({ ...form, category: e.target.value });
                      setCategoryOpen(true);
                    }}
                    onFocus={() => setCategoryOpen(true)}
                    // Delay so a click on an option registers before the list closes.
                    onBlur={() => setTimeout(() => setCategoryOpen(false), 120)}
                    placeholder="Type or pick a category"
                    autoComplete="off"
                  />

                  {categoryOpen && categoryMatches.length > 0 && (
                    <ul className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-lg">
                      {categoryMatches.map((c) => (
                        <li key={c}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()} // keep focus so onBlur doesn't fire first
                            onClick={() => {
                              setForm({ ...form, category: c });
                              setCategoryOpen(false);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-body-text transition hover:bg-accent hover:text-accent-text"
                          >
                            {c}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="mt-1 text-xs text-body-text">
                  Leave blank for no category, or type a new one to create it.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-body-text">Image</label>
                <div className="flex items-start gap-3">
                  {/* Preview */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-highlight">
                    {form.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImageOff className="h-6 w-6 text-caption-text" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-body-text transition hover:bg-highlight disabled:opacity-60"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" /> {form.image ? "Replace image" : "Upload image"}
                          </>
                        )}
                      </button>
                      {form.image && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image: "" })}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-body-text transition hover:bg-highlight hover:text-heading-text"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="mt-1.5 truncate text-xs text-body-text">
                      {form.image ? form.image : "PNG or JPG, up to 25 MB. Optional."}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-body-text transition hover:bg-highlight"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-text transition hover:bg-primary-dark disabled:opacity-60"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editing ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm dialog for destructive actions */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
            <div className="flex gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  confirmTarget.action === "delete"
                    ? "bg-red-100 dark:bg-red-950/40"
                    : "bg-amber-100 dark:bg-amber-950/40"
                }`}
              >
                {confirmTarget.action === "delete" ? (
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                ) : (
                  <EyeOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-heading-text">
                  {confirmTarget.action === "delete" ? "Delete product?" : "Hide from store?"}
                </h2>
                <p className="mt-1.5 text-sm text-body-text">
                  {confirmTarget.action === "delete" ? (
                    <>
                      <span className="font-medium text-heading-text">
                        {confirmTarget.product.name}
                      </span>{" "}
                      will be permanently removed. This can&apos;t be undone — and products that
                      have already been ordered can&apos;t be deleted at all.
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-heading-text">
                        {confirmTarget.product.name}
                      </span>{" "}
                      will stop showing in the store. Order history is kept and you can restore it
                      any time.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-body-text transition hover:bg-highlight"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => runAction(confirmTarget.product, confirmTarget.action)}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                  confirmTarget.action === "delete"
                    ? "bg-danger hover:bg-danger-dark"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {confirmTarget.action === "delete" ? "Delete permanently" : "Hide product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
