/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * One-time: set category "gemstones" on products with missing/empty category.
 * Run: npm run migrate:uncategorized-products
 * Then adjust categories in admin as needed.
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

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
const envDot = path.join(process.cwd(), ".env");
if (fs.existsSync(envDot)) {
  const lines = fs.readFileSync(envDot, "utf8").split(/\r?\n/);
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
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: "astrology-app" });
  const db = mongoose.connection.db;
  const filter = {
    $or: [{ category: null }, { category: "" }, { category: { $exists: false } }],
  };
  const result = await db.collection("products").updateMany(filter, {
    $set: { category: "gemstones" },
  });
  console.log("matched:", result.matchedCount, "modified:", result.modifiedCount);
  const sample = await db
    .collection("products")
    .find({}, { projection: { title: 1, category: 1 } })
    .limit(20)
    .toArray();
  console.log("sample:", sample);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
