import { existsSync } from "fs";
import path from "path";
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

/** Find directory containing .env / .env.local (cwd may differ under Turbopack workers). */
function resolveProjectRootWithEnv(): string {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (existsSync(path.join(dir, ".env")) || existsSync(path.join(dir, ".env.local"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

const envRoot = resolveProjectRootWithEnv();
// Next caches the first loadEnvConfig result; if that ran with a cwd that had no .env,
// a later call would skip loading. Force merge from the real project root.
loadEnvConfig(envRoot, process.env.NODE_ENV !== "production", console, true);

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: CachedMongoose | undefined;
}

const cached: CachedMongoose = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  const mongodbUri = process.env.MONGODB_URI?.trim();
  if (!mongodbUri) {
    console.error(
      "[connectDB] MONGODB_URI is missing after loadEnvConfig. cwd=%s envRoot=%s",
      process.cwd(),
      envRoot,
    );
    throw new Error("Please define the MONGODB_URI environment variable.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri, { dbName: "astrology-app" });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
