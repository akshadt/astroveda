import mongoose from "mongoose";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

const MONGODB_URI: string = mongodbUri;

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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "astrology-app" });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
