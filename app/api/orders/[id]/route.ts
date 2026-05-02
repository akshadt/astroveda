import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import type { NextRequest } from "next/server";

type Context = { params: Promise<{ id: string }> };

// Public GET (used by Razorpay UPI polling). Return only safe fields.
export async function GET(_req: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: order._id,
      status: order.status,
      totalAmount: order.totalAmount,
      items: order.items,
      createdAt: order.createdAt,
    });
  } catch (error: unknown) {
    console.error("[GET /api/orders/[id]] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
