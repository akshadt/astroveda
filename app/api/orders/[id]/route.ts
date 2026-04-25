import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: unknown) {
    console.error("[ORDER_BY_ID_GET] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
