"use server";

import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

// --- Update User Role Server Action ---
// Server-enforced superadmin guard runs before the mutation so a direct
// POST to this action without visiting the page still gets blocked.
// Writes directly to the frontend auth database via Drizzle's update
// builder, matching on the user's primary key. After the write, calls
// revalidatePath to purge the Next.js cache for /admin/users so the
// server-rendered UserTable reflects the new role without a full reload.
export async function changeUserRole(userId: string, role: string) {
  await requireAdmin("superadmin");
  await db.update(user).set({ role }).where(eq(user.id, userId));
  revalidatePath("/admin/users");
}
