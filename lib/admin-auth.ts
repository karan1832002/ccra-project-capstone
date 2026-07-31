import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type AdminRole = "admin" | "superadmin";
export type AdminSession = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function requireAdmin(targetRole?: AdminRole): Promise<{
  session: NonNullable<AdminSession>;
  role: AdminRole;
}> {
  const incomingHeaders = await headers();
  const session = await auth.api.getSession({ headers: incomingHeaders });

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