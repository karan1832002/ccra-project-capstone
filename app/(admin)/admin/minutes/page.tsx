import "server-only";

import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMinutes } from "@/lib/gateway-client";
import MinutesManager from "./MinutesManager";

export default async function AdminMinutesPage() {
  await requireAdmin();
  const minutes = await getAdminMinutes();

  return (
    <div className="p-6 md:p-8">
      <MinutesManager minutes={minutes} />
    </div>
  );
}