 "use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import OrdersTable from "@/components/admin/OrdersTable";
import Spinner from "@/components/ui/Spinner";
import type { Order } from "@/lib/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [] as Order[],
  });
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
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", { credentials: "include" });
        if (!res.ok) {
          throw new Error(await extractErrorMessage(res));
        }
        const data = await res.json();
        setStats(data);
      } catch (err: unknown) {
        console.error("Stats fetch failed:", err);
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-playfair text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={`${stats.totalOrders}`}
          trend="+12%"
          trendDirection="up"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          trend="+5%"
          trendDirection="up"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <StatCard
          title="Pending Orders"
          value={`${stats.pendingOrders}`}
          trend="-2%"
          trendDirection="down"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 font-playfair">Recent Orders</h2>
        </div>
        
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
            <OrdersTable orders={stats.recentOrders} />
          </>
        )}
      </div>
    </div>
  );
}
