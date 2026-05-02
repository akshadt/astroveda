import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { withAdminAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const blog = await Blog.findOne({ slug, published: { $ne: false } });
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    const blogs = await Blog.find({ published: { $ne: false } }).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error: unknown) {
    console.error("[BLOGS_GET] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();

    if (body.image && body.image.startsWith("data:image")) {
      const uploadUrl = await uploadImage(body.image);
      if (uploadUrl) {
        body.image = uploadUrl;
      } else {
        throw new Error("Image upload failed");
      }
    }

    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (error: unknown) {
    console.error("[BLOGS_POST] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
});
