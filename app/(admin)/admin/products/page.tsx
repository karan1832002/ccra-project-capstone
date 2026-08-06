// Admin products page. Loads every product (including hidden ones) on the
// server, then hands them to the client manager for create/edit/hide actions.
import { getAdminProducts } from "./actions";
import ProductManager from "./ProductManager";

export const dynamic = "force-dynamic"; // admin data must never be cached

export default async function AdminProductsPage() {
  let products;
  let errorMsg: string | null = null;

  try {
    products = await getAdminProducts();
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "unknown error";
  }

  if (errorMsg || !products) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-stone-950">Products</h1>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load products: {errorMsg ?? "unknown error"}
        </div>
      </div>
    );
  }

  return <ProductManager products={products} />;
}
