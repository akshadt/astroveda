/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const [key, ...rest] = line.split("=");
    if (key && !process.env[key]) {
      process.env[key] = rest.join("=");
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: "astrology-app" });

  const username = "omkkaarastroworld";
  const password = "o1234@9876a";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await Admin.findOneAndUpdate(
    { username },
    { username, passwordHash },
    { upsert: true, new: true },
  );

  // Remove legacy default admin if present
  if (username !== "admin") {
    await Admin.deleteOne({ username: "admin" });
  }

  console.log(`Admin ensured: username=${admin.username} password=${password}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
