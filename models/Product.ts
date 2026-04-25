import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    zodiac: { type: String, default: "" },
    certification: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Product = models.Product || model("Product", productSchema);

export default Product;
