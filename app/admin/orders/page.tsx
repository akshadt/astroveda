"use client";

import { useEffect, useState } from "react";
import OrdersTable from "@/components/admin/OrdersTable";
import Spinner from "@/components/ui/Spinner";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractErrorMessage = async (response: Response) => {
    try {
      const body = await response.json();
      return body.error || `Request failed: ${response.status}`;
    } catch {
      return `Request failed: ${response.status}`;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const res = await fetch(`/api/orders${query}`, { credentials: "include" });
        if (!res.ok) {
          throw new Error(await extractErrorMessage(res));
        }
        const data = (await res.json()) as Order[];
        setOrders(data);
      } catch (err: unknown) {
        console.error("Orders fetch failed:", err);
        setError(err instanceof Error ? err.message : "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair text-gray-900">Orders Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all customer orders.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto">
        {["all", "paid", "pending", "failed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2.5 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
              filter === status
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-10 flex justify-center">
            <Spinner className="w-8 h-8 text-[#7C3AED]" />
          </div>
        ) : (
          <>
            {error && (
              <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <OrdersTable orders={orders} />
          </>
        )}
      </div>
    </div>
  );
}
