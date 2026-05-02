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

  console.log("[VERIFY] received body keys:", Object.keys(parsed));

  const secret = getRazorpayKeySecret();
  console.log("[VERIFY] razorpay_order_id:", typeof parsed.razorpay_order_id === "string" ? parsed.razorpay_order_id : null);
  console.log(
    "[VERIFY] razorpay_payment_id:",
    typeof parsed.razorpay_payment_id === "string" ? parsed.razorpay_payment_id : null,
  );
  console.log("[VERIFY] orderId:", typeof parsed.orderId === "string" ? parsed.orderId : null);
  console.log("[VERIFY] signature received:", !!parsed.razorpay_signature);
  console.log("[VERIFY] RAZORPAY_SECRET set:", !!process.env.RAZORPAY_SECRET);
  console.log("[VERIFY] RAZORPAY_SECRET length:", process.env.RAZORPAY_SECRET?.trim().length || 0);
  console.log("[VERIFY] RAZORPAY_KEY_SECRET set:", !!process.env.RAZORPAY_KEY_SECRET);
  console.log("[VERIFY] RAZORPAY_KEY_SECRET length:", process.env.RAZORPAY_KEY_SECRET?.trim().length || 0);

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
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      console.error("[VERIFY] Missing required fields:", {
        razorpay_order_id: !!razorpay_order_id,
        razorpay_payment_id: !!razorpay_payment_id,
        razorpay_signature: !!razorpay_signature,
        orderId: !!orderId,
      });
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }

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

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    console.log("[VERIFY] HMAC input string:", payload);
    console.log("[VERIFY] signatures match:", generatedSignature.toLowerCase() === razorpay_signature.toLowerCase());

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
