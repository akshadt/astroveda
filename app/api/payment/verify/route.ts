import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import { getRazorpayKeySecret } from "@/lib/razorpaySecret";

/** Timing-safe compare for Razorpay hex signatures (SHA-256 HMAC digest). */
function timingSafeEqualHexDigest(expectedHex: string, receivedHex: string): boolean {
  const x = expectedHex.toLowerCase().trim();
  const y = receivedHex.toLowerCase().trim();
  if (x.length !== y.length) return false;
  if (!/^[0-9a-f]+$/i.test(x) || !/^[0-9a-f]+$/i.test(y)) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(x, "hex"), Buffer.from(y, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let parsed: Record<string, unknown>;
  try {
    parsed = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  console.log("[PAYMENT_VERIFY] input keys:", Object.keys(parsed), "orderId present:", !!parsed.orderId);

  const secret = getRazorpayKeySecret();
  if (!secret) {
    console.error("[PAYMENT_VERIFY] Missing RAZORPAY_SECRET or RAZORPAY_KEY_SECRET");
    return NextResponse.json({ error: "Payment verification is not configured." }, { status: 500 });
  }

  try {
    await connectDB();
  } catch (error: unknown) {
    console.error("[PAYMENT_VERIFY] DB connection error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }

  const orderId = typeof parsed.orderId === "string" ? parsed.orderId.trim() : "";
  const razorpay_order_id =
    typeof parsed.razorpay_order_id === "string" ? parsed.razorpay_order_id.trim() : "";
  const razorpay_payment_id =
    typeof parsed.razorpay_payment_id === "string" ? parsed.razorpay_payment_id.trim() : "";
  const razorpay_signature =
    typeof parsed.razorpay_signature === "string" ? parsed.razorpay_signature.trim() : "";

  try {
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      console.log("[PAYMENT_VERIFY] idempotent: order already paid", orderId);
      return NextResponse.json({ success: true, orderId, alreadyPaid: true });
    }

    const markFailed = async (message: string) => {
      const fresh = await Order.findById(orderId);
      if (fresh?.status === "paid") {
        console.log("[PAYMENT_VERIFY] skip failed state; order became paid", orderId);
        return NextResponse.json({ success: true, orderId, alreadyPaid: true });
      }
      try {
        await Order.findByIdAndUpdate(orderId, { status: "failed" });
        await Payment.create({
          orderId,
          razorpay_order_id: razorpay_order_id || "unknown",
          razorpay_payment_id: razorpay_payment_id || undefined,
          razorpay_signature: razorpay_signature || undefined,
          status: "failed",
        });
      } catch (err: unknown) {
        console.error("[PAYMENT_VERIFY] failed to persist failure state:", err);
      }
      return NextResponse.json({ error: message }, { status: 400 });
    };

    if (!razorpay_payment_id) {
      return markFailed("Payment verification failed: missing payment id");
    }
    if (!razorpay_order_id) {
      return markFailed("Payment verification failed: missing Razorpay order id");
    }
    if (!razorpay_signature) {
      return markFailed("Payment verification failed: missing signature");
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    console.log("[PAYMENT_VERIFY] HMAC payload (order_id|payment_id):", payload);
    console.log("[PAYMENT_VERIFY] generated signature:", generatedSignature);
    console.log("[PAYMENT_VERIFY] received signature:", razorpay_signature);

    if (!timingSafeEqualHexDigest(generatedSignature, razorpay_signature)) {
      console.warn("[PAYMENT_VERIFY] signature mismatch");
      return markFailed("Payment verification failed: invalid signature");
    }

    const existingSuccess = await Payment.findOne({
      orderId,
      razorpay_payment_id,
      status: "success",
    });
    if (existingSuccess) {
      await Order.findByIdAndUpdate(orderId, {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      });
      console.log("[PAYMENT_VERIFY] duplicate verify; Payment success already recorded");
      return NextResponse.json({ success: true, orderId, duplicate: true });
    }

    await Order.findByIdAndUpdate(orderId, {
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    });

    try {
      await Payment.create({
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      });
    } catch (pe: unknown) {
      console.error("[PAYMENT_VERIFY] Payment ledger row failed (order kept paid):", pe);
    }

    console.log("[PAYMENT_VERIFY] success orderId:", orderId);
    return NextResponse.json({ success: true, orderId });
  } catch (error: unknown) {
    console.error("[PAYMENT_VERIFY] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
