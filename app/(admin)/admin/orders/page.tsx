// Admin orders page. Loads every order with its line items on the server, then
// hands them to the client manager for filtering and status changes.
import { getAdminOrders } from "./actions";
import OrderManager from "./OrderManager";

export const dynamic = "force-dynamic"; // admin data must never be cached

export default async function AdminOrdersPage() {
  let orders;
  let errorMsg: string | null = null;

  try {
    orders = await getAdminOrders();
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : "unknown error";
  }

  if (errorMsg || !orders) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-stone-950">Orders</h1>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load orders: {errorMsg ?? "unknown error"}
        </div>
      </div>
    );
  }

  return <OrderManager orders={orders} />;
}
