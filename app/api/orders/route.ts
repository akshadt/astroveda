import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { withAdminAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { userInfo, items, totalAmount, address } = body;

    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const order = await Order.create({
      userInfo,
      address,
      items,
      totalAmount,
      receipt,
      status: "pending",
    });

    return NextResponse.json({ orderId: order._id });
  } catch (error: unknown) {
    console.error("[POST /api/orders] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const status = req.nextUrl.searchParams.get("status");
    const query =
      status && ["paid", "pending", "completed", "failed"].includes(status) ? { status } : {};

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: unknown) {
    console.error("[ORDERS_GET] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
});
