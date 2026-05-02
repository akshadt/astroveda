/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Normalize product.category to one of: healing | gemstones | rudraksha | pooja
 * Logs unique values before/after. Run: npm run migrate:product-categories-enum
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

const ALLOWED = new Set(["healing", "gemstones", "rudraksha", "pooja"]);
const ALIASES = {
  gemstone: "gemstones",
  "gem stones": "gemstones",
  "gem stone": "gemstones",
  "healing crystals": "healing",
  "healing crystal": "healing",
  "pooja items": "pooja",
  "pooja item": "pooja",
};

function normalize(cat) {
  if (cat == null || cat === "") return "gemstones";
  if (typeof cat !== "string") return "gemstones";
  const key = cat.toLowerCase().trim();
  if (ALIASES[key]) return ALIASES[key];
  if (ALLOWED.has(key)) return key;
  return "gemstones";
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: "astrology-app" });
  const coll = mongoose.connection.db.collection("products");

  const before = await coll.distinct("category");
  console.log("Unique category values BEFORE:", before);

  const sample = await coll.find({}, { projection: { title: 1, category: 1 } }).limit(30).toArray();
  console.log("Sample (title, category):", sample.map((d) => ({ title: d.title, category: d.category })));

  const cursor = coll.find({});
  let updated = 0;
  for await (const doc of cursor) {
    const next = normalize(doc.category);
    if (doc.category !== next) {
      await coll.updateOne({ _id: doc._id }, { $set: { category: next } });
      updated++;
    }
  }

  const after = await coll.distinct("category");
  console.log("Documents updated:", updated);
  console.log("Unique category values AFTER:", after);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
