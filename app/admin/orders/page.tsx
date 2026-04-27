"use client";

import { useEffect, useState } from "react";
import OrdersTable from "@/components/admin/OrdersTable";
import Spinner from "@/components/ui/Spinner";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | Order["status"]>("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
        const res = await fetch(`/api/orders`, { credentials: "include" });
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
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to update status");
      }

      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o)));

      setSuccessMessage(`Order status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Status update failed:", err);
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const tabs: Array<"all" | Order["status"]> = ["all", "paid", "pending", "completed", "failed"];
  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair text-gray-900">Orders Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all customer orders.</p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          ✅ {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          ❌ {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const count = tab === "all" ? orders.length : orders.filter((o) => o.status === tab).length;
          const label = tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-[#F97316] text-white"
                  : "bg-white text-[#0F172A] border border-[#E2E8F0] hover:border-[#F97316]"
              }`}
            >
              {label}
              <span
                className={`text-xs rounded-full px-2 py-0.5 ${
                  activeTab === tab ? "bg-white text-[#F97316]" : "bg-[#F97316] text-white"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-10 flex justify-center">
            <Spinner className="w-8 h-8 text-[#7C3AED]" />
          </div>
        ) : (
          <>
            <OrdersTable orders={filteredOrders} onStatusChange={handleStatusChange} />
          </>
        )}
      </div>
    </div>
  );
}
