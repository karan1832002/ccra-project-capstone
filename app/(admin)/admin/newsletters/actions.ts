"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { newsletters } from "@/lib/db/schema/newsletters";
import { desc, eq } from "drizzle-orm";

// --- Newsletter Actions ---
// All mutations call revalidatePath("/admin/newsletters") to purge the
// Next.js server-side cache so the admin table reflects changes without
// a manual browser refresh. Reads do not revalidate — Drizzle executes
// a fresh query on every invocation.

export type NewsletterRow = typeof newsletters.$inferSelect;

// Fetches every newsletter record, newest first.
// Used by the admin data table for full-collection visibility.
export async function getAdminNewsletters(): Promise<NewsletterRow[]> {
  return db
    .select()
    .from(newsletters)
    .orderBy(desc(newsletters.createdAt));
}

// Fetches only published newsletters.
// Used by public-facing consumers that must exclude drafts.
export async function getPublishedNewsletters(): Promise<NewsletterRow[]> {
  return db
    .select()
    .from(newsletters)
    .where(eq(newsletters.published, true))
    .orderBy(newsletters.createdAt);
}

// Fetches a single newsletter by primary key.
// Used by the public-facing dynamic article route.
export async function getNewsletterById(id: string) {
  const [row] = await db
    .select()
    .from(newsletters)
    .where(eq(newsletters.id, id));
  return row ?? null;
}

// Inserts a new newsletter row from the admin creation form.
// Accepts raw FormData so it can be wired directly to <form action>.
// Required fields: title, date, description, content.
// The published checkbox value is "on" when checked, otherwise null.
export async function createNewsletter(formData: FormData) {
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  if (!title || !date || !description || !content) {
    throw new Error("Title, date, description, and content are required.");
  }

  await db
    .insert(newsletters)
    .values({ title, date, description, content, published });
  revalidatePath("/admin/newsletters");
  redirect("/admin/newsletters");
}

// Updates all mutable fields on an existing newsletter row.
// Reads the row id from a hidden form field. title, date, description,
// and content are required; published is derived from the checkbox.
export async function updateNewsletter(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  if (!id || !title || !date || !description || !content) {
    throw new Error("All fields are required.");
  }

  await db
    .update(newsletters)
    .set({ title, date, description, content, published })
    .where(eq(newsletters.id, id));
  revalidatePath("/admin/newsletters");
  redirect("/admin/newsletters");
}

// Toggles the published flag on an existing newsletter.
// Expects the row id and target published value as hidden form fields
// so the same action handles both publish and unpublish transitions
// via a plain <form> submission.
export async function updateNewsletterStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const published = formData.get("published") === "true";

  if (!id) {
    throw new Error("Newsletter ID is required.");
  }

  await db
    .update(newsletters)
    .set({ published })
    .where(eq(newsletters.id, id));
  revalidatePath("/admin/newsletters");
}

// Hard-deletes a newsletter row by primary key.
// Reads the target id from a hidden form field.
export async function deleteNewsletter(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Newsletter ID is required.");
  }

  await db.delete(newsletters).where(eq(newsletters.id, id));
  revalidatePath("/admin/newsletters");
}