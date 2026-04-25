import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { withAdminAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userInfo, items, totalAmount } = await req.json();
    const order = await Order.create({
      userInfo,
      items,
      totalAmount,
      status: "pending",
    });

    return NextResponse.json({ orderId: order._id });
  } catch (error: unknown) {
    console.error("[ORDERS_POST] error:", error);
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
      status && ["paid", "pending", "failed"].includes(status) ? { status } : {};

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
