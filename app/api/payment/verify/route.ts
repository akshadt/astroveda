import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Payment from "@/models/Payment";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await req.json();

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (isValid) {
      await Order.findByIdAndUpdate(orderId, { status: "paid" });
      await Payment.create({
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      });
      return NextResponse.json({ success: true, orderId });
    }

    await Order.findByIdAndUpdate(orderId, { status: "failed" });
    await Payment.create({
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "failed",
    });
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  } catch (error: unknown) {
    console.error("[PAYMENT_VERIFY] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
