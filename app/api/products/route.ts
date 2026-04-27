import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { withAdminAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const query: any = { isActive: true };
    if (category) query.category = category;
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error("[PRODUCTS_GET] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = withAdminAuth(async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    let imageUrl = body.image;

    if (imageUrl && imageUrl.startsWith("data:image")) {
      try {
        imageUrl = await uploadImage(imageUrl);
      } catch (err: unknown) {
        return NextResponse.json({ error: 'Image upload failed: ' + (err instanceof Error ? err.message : 'Unknown error') }, { status: 500 });
      }
    }

    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: body.price,
      image: imageUrl,
      zodiac: body.zodiac,
      certification: body.certification,
      category: body.category,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("[PRODUCTS_POST] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
});
