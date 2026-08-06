"use server";

import { revalidatePath } from "next/cache";
import { callGateway } from "@/lib/gateway-client";

// --- Product Actions ---
// Products live in the product-service (not the frontend DB), so every action
// goes through callGateway, which attaches the verified session role the
// backend's requireRole("admin") checks. Mutations revalidate the admin page
// so the table reflects changes without a manual refresh.

export type AdminProduct = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  image: string | null;
  category: string | null;
  stock: number;
  active: boolean;
  createdAt: string;
};

// What the create/edit form sends. Price arrives in cents already.
export type ProductInput = {
  name: string;
  description?: string;
  priceCents: number;
  image?: string;
  category?: string;
  stock: number;
};

// Every product, including deactivated ones (admin-only endpoint).
export async function getAdminProducts(): Promise<AdminProduct[]> {
  return callGateway<AdminProduct[]>("/api/store/admin/products");
}

// Adds a new product to the store.
export async function createProduct(data: ProductInput) {
  const result = await callGateway<AdminProduct>("/api/store/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/admin/products");
  return result;
}

// Updates any subset of a product's fields (price, stock, active, ...).
export async function updateProduct(id: string, data: Partial<ProductInput & { active: boolean }>) {
  const result = await callGateway<AdminProduct>(`/api/store/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidatePath("/admin/products");
  return result;
}

// Soft-delete: hides the product from the storefront but keeps order history.
export async function deactivateProduct(id: string) {
  await callGateway<{ message: string }>(`/api/store/products/${id}`, {
    method: "DELETE",
  });
  revalidatePath("/admin/products");
}

// Puts a deactivated product back in the storefront.
export async function restoreProduct(id: string) {
  return updateProduct(id, { active: true });
}

// Permanently deletes a product. The backend refuses (409 PRODUCT_HAS_ORDERS)
// if the product appears in any order, so history can never be orphaned.
export async function deleteProductPermanently(id: string) {
  await callGateway<{ message: string }>(`/api/store/products/${id}/permanent`, {
    method: "DELETE",
  });
  revalidatePath("/admin/products");
}

// Asks the AI service to draft a store description from the product name and
// category. Nothing is saved — the admin reviews/edits the text first.
export async function generateDescription(name: string, category?: string) {
  const result = await callGateway<{ description: string }>("/api/chat/product-description", {
    method: "POST",
    body: JSON.stringify({ name, category: category || undefined }),
  });
  return result.description;
}
