import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const User = models.User || model("User", userSchema);

export default User;
