import "server-only";

import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth-session";

export type AdminRole = "admin" | "superadmin";
export type AdminSession = Awaited<ReturnType<typeof getCachedSession>>;

export async function requireAdmin(targetRole?: AdminRole): Promise<{
  session: NonNullable<AdminSession>;
  role: AdminRole;
}> {
  const session = await getCachedSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const role = ((session.user as { role?: string }).role ?? "member") as string;

  if (role !== "admin" && role !== "superadmin") {
    redirect("/");
  }

  if (targetRole && role !== targetRole) {
    redirect("/");
  }

  return { session: session as NonNullable<AdminSession>, role: role as AdminRole };
}
