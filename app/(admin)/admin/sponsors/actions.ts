"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { sponsors } from "@/lib/db/schema/sponsors";
import { desc, eq } from "drizzle-orm";

// --- Sponsor Actions ---
// All mutations call revalidatePath("/admin/sponsors") to purge the
// Next.js server-side cache so the admin table reflects changes without
// a manual browser refresh. Reads do not revalidate — Drizzle executes
// a fresh query on every invocation.

export type SponsorRow = typeof sponsors.$inferSelect;

// Fetches every sponsor record, newest first.
// Used by the admin data table for full-collection visibility.
export async function getAdminSponsors(): Promise<SponsorRow[]> {
  return db
    .select()
    .from(sponsors)
    .orderBy(desc(sponsors.createdAt));
}

// Fetches sponsors with visible=true.
// Used by public-facing consumers that must exclude hidden sponsors.
export async function getVisibleSponsors(): Promise<SponsorRow[]> {
  return db
    .select()
    .from(sponsors)
    .where(eq(sponsors.visible, true))
    .orderBy(sponsors.createdAt);
}

// Fetches a single sponsor by primary key.
// Returns null when no row matches so the caller can handle the miss.
export async function getSponsorById(id: string) {
  const [row] = await db
    .select()
    .from(sponsors)
    .where(eq(sponsors.id, id));
  return row ?? null;
}

// Inserts a new sponsor row from the admin creation form.
// name is required; logo, website, and visible are optional.
// The visible checkbox value is "on" when checked, otherwise null.
export async function createSponsor(formData: FormData) {
  const name = formData.get("name") as string;
  const logo = (formData.get("logo") as string) || null;
  const website = (formData.get("website") as string) || null;
  const visible = formData.get("visible") === "on";

  if (!name) {
    throw new Error("Sponsor name is required.");
  }

  await db
    .insert(sponsors)
    .values({ name, logo, website, visible });
  revalidatePath("/admin/sponsors");
  redirect("/admin/sponsors");
}

// Updates all mutable fields on an existing sponsor row.
// Reads the row id from a hidden form field. name is required;
// logo, website, and visible are derived from the form payload.
export async function updateSponsor(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const logo = (formData.get("logo") as string) || null;
  const website = (formData.get("website") as string) || null;
  const visible = formData.get("visible") === "on";

  if (!id || !name) {
    throw new Error("Sponsor ID and name are required.");
  }

  await db
    .update(sponsors)
    .set({ name, logo, website, visible })
    .where(eq(sponsors.id, id));
  revalidatePath("/admin/sponsors");
  redirect("/admin/sponsors");
}

// Toggles the visible flag on an existing sponsor.
// Expects the row id and target visible value as hidden form fields
// so the same action handles both show and hide transitions
// via a plain form submission.
export async function updateSponsorVisibility(formData: FormData) {
  const id = formData.get("id") as string;
  const visible = formData.get("visible") === "true";

  if (!id) {
    throw new Error("Sponsor ID is required.");
  }

  await db
    .update(sponsors)
    .set({ visible })
    .where(eq(sponsors.id, id));
  revalidatePath("/admin/sponsors");
}

// Hard-deletes a sponsor row by primary key.
// Reads the target id from a hidden form field.
export async function deleteSponsor(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Sponsor ID is required.");
  }

  await db.delete(sponsors).where(eq(sponsors.id, id));
  revalidatePath("/admin/sponsors");
}