import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import { getRazorpayKeySecret } from "@/lib/razorpaySecret";

/**
 * Server-side reconciliation for UPI flows where Razorpay handler doesn't fire.
 * Checks Razorpay for payments on the stored razorpayOrderId and marks Order as paid when captured/authorized.
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as { orderId?: string };
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status === "paid") return NextResponse.json({ paid: true, orderId });

    const rpOrderId = typeof order.razorpayOrderId === "string" ? order.razorpayOrderId.trim() : "";
    if (!rpOrderId) {
      return NextResponse.json({ paid: false, orderId, status: order.status, reason: "missing_razorpay_order_id" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = getRazorpayKeySecret();
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Fetch payments for this Razorpay order.
    const paymentsResp = await razorpay.orders.fetchPayments(rpOrderId);
    const items: any[] = Array.isArray((paymentsResp as any)?.items) ? (paymentsResp as any).items : [];

    // Prefer captured, else authorized.
    const successful = items.find((p) => p?.status === "captured") || items.find((p) => p?.status === "authorized");
    if (!successful) {
      return NextResponse.json({ paid: false, orderId, razorpayOrderId: rpOrderId });
    }

    const paymentId = String(successful.id || "").trim();
    if (!paymentId) {
      return NextResponse.json({ paid: false, orderId, razorpayOrderId: rpOrderId, reason: "missing_payment_id" });
    }

    // Idempotency: if we already recorded this payment success, just ensure order is paid.
    const existing = await Payment.findOne({ orderId, razorpay_payment_id: paymentId, status: "success" });

    await Order.findByIdAndUpdate(orderId, {
      status: "paid",
      razorpayPaymentId: paymentId,
      razorpayOrderId: rpOrderId,
    });

    if (!existing) {
      await Payment.create({
        orderId,
        razorpay_order_id: rpOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: undefined,
        status: "success",
      });
    }

    return NextResponse.json({ paid: true, orderId, razorpay_payment_id: paymentId });
  } catch (error: unknown) {
    console.error("[PAYMENT_POLL] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

