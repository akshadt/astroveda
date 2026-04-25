import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("Please define the JWT_SECRET environment variable.");
}

const JWT_SECRET: string = jwtSecret;

type JwtPayload = {
  username: string;
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

type RouteContext = {
  params?: Promise<Record<string, string>>;
};

type AdminHandler = (
  req: NextRequest,
  context: RouteContext,
  adminPayload: JwtPayload,
) => Promise<Response>;

export function withAdminAuth(handler: AdminHandler) {
  return async (req: NextRequest, context: RouteContext = {}) => {
    try {
      const token = req.cookies.get("admin_token")?.value;

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const adminPayload = verifyToken(token);
      return await handler(req, context, adminPayload);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
