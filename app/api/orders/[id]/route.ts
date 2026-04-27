import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { withAdminAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";

type Context = { params?: Promise<Record<string, string>> };

export const GET = withAdminAuth(async (_req: NextRequest, context: Context) => {
  try {
    await connectDB();
    const params = await context.params;
    const id = params?.id;
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
});
