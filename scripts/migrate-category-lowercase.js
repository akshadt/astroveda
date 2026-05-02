/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * One-time migration: normalize Product.category and Service.category to lowercase.
 * Run: node scripts/migrate-category-lowercase.js
 * Loads env from .env.local (same pattern as seed-services.js).
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const [key, ...rest] = line.split("=");
    if (key && !process.env[key]) {
      process.env[key] = rest.join("=");
    }
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: "astrology-app" });
  const db = mongoose.connection.db;

  const trimLower = [{ $set: { category: { $toLower: { $trim: { input: "$category" } } } } }];

  const products = await db.collection("products").updateMany({ category: { $exists: true, $type: "string" } }, trimLower);
  const services = await db.collection("services").updateMany({ category: { $exists: true, $type: "string" } }, trimLower);

  console.log("products matched:", products.matchedCount, "modified:", products.modifiedCount);
  console.log("services matched:", services.matchedCount, "modified:", services.modifiedCount);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
