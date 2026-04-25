import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST() {
  try {
    await connectDB();

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
    return res;
  } catch (error: unknown) {
    console.error("[ADMIN_LOGOUT] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
