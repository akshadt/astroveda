import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { orderId, amount } = await req.json();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: String(orderId),
    });

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error: unknown) {
    console.error("[PAYMENT_CREATE_ORDER] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
