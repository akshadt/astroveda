import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { withAdminAuth } from "@/lib/auth";

export const GET = withAdminAuth(async () => {
  try {
    await connectDB();

    const [totalOrders, pendingOrders, revenueAgg, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return NextResponse.json({
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      pendingOrders,
      recentOrders,
    });
  } catch (error: unknown) {
    console.error("[ADMIN_STATS] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
});
