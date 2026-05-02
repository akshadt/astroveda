/**
 * Razorpay dashboard "Key secret" — support common env names (Vercel often uses RAZORPAY_KEY_SECRET).
 */
export function getRazorpayKeySecret(): string {
  const a = process.env.RAZORPAY_SECRET?.trim();
  const b = process.env.RAZORPAY_KEY_SECRET?.trim();
  return a || b || "";
}
