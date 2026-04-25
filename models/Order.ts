import { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    userInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [
      {
        itemId: { type: Schema.Types.ObjectId },
        itemType: {
          type: String,
          enum: ["service", "product"],
          required: true,
        },
        title: { type: String },
        price: { type: Number },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Order = models.Order || model("Order", orderSchema);

export default Order;
