import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";

export const GET = withAdminAuth(async (_req, _context, adminPayload) => {
  try {
    await connectDB();
    return NextResponse.json({ username: adminPayload.username });
  } catch (error: unknown) {
    console.error("[ADMIN_ME] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
});
