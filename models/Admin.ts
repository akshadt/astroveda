import { Schema, model, models } from "mongoose";

const adminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Admin = models.Admin || model("Admin", adminSchema);

export default Admin;
