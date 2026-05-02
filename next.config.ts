import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// Load .env early; dev flag matches NODE_ENV so .env.development* merge correctly.
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const nextConfig: NextConfig = {
  /* App Router: use experimental body limits below (Pages Router `api.bodyParser` does not apply here). */
  serverExternalPackages: ["mongoose", "bcryptjs"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    proxyClientMaxBodySize: "10mb",
  },
};

export default nextConfig;
