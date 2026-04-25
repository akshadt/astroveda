import { Schema, model, models } from "mongoose";

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    status: { type: String, enum: ["success", "failed"], required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Payment = models.Payment || model("Payment", paymentSchema);

export default Payment;
