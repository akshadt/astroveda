/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed Home / Office / Industrial Vastu services (skip if title already exists).
 * Run: npm run seed-vastu
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
  console.error("Missing MONGODB_URI in .env.local or .env");
  process.exit(1);
}

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String },
    image: { type: String },
    category: { type: String, default: "vastu" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

const vastuServices = [
  {
    title: "Home Vastu",
    description:
      "Complete home Vastu analysis with room-by-room recommendations, lucky directions, and written remedies report. Follow-up consultation included.",
    price: 10000,
    duration: "Includes site visit",
    category: "vastu",
    isActive: true,
  },
  {
    title: "Office Vastu",
    description:
      "Full office layout analysis including cabin directions, seating optimization, energy flow, and business growth remedies. Written report with 2 follow-ups.",
    price: 15000,
    duration: "Includes site visit",
    category: "vastu",
    isActive: true,
  },
  {
    title: "Industrial Vastu",
    description:
      "Complete industrial unit analysis covering factory layout, machinery placement, worker productivity, and full Vastu compliance report. On-site visit included.",
    price: 30000,
    duration: "Includes on-site visit",
    category: "vastu",
    isActive: true,
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: "astrology-app" });

  for (const service of vastuServices) {
    const existing = await Service.findOne({ title: service.title });
    if (existing) {
      console.log(`Skipped: ${service.title} (already exists)`);
      continue;
    }
    await Service.create(service);
    console.log(`Created: ${service.title}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
