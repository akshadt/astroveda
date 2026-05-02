/* eslint-disable @typescript-eslint/no-require-imports */
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

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

/** Homepage pricing uses Vastu services — run `npm run seed-vastu`. */
const services = [];

async function seedServices() {
  await mongoose.connect(MONGODB_URI, { dbName: "astrology-app" });

  for (const service of services) {
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

seedServices().catch(async (error) => {
  console.error("Seed services failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
