import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import { withAdminAuth } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const service = await Service.findOne({ _id: id, isActive: true });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: unknown) {
    console.error("[SERVICE_BY_ID_GET] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

export const PUT = withAdminAuth(async (req, context) => {
  try {
    await connectDB();
    const { id } = await (context.params as Promise<{ id: string }>);
    const body = await req.json();

    const updateData: Record<string, unknown> = {
      title: body.title,
      description: body.description,
      price: body.price,
      duration: body.duration,
    };

    if (typeof body.category === "string") {
      updateData.category = body.category.toLowerCase();
    }

    if (body.image) {
      let imageUrl = body.image;
      if (imageUrl.startsWith("data:image")) {
        try {
          const { uploadImage } = await import("@/lib/cloudinary");
          imageUrl = await uploadImage(imageUrl);
        } catch (err: unknown) {
          return NextResponse.json({ error: 'Image upload failed: ' + (err instanceof Error ? err.message : 'Unknown error') }, { status: 500 });
        }
      }
      updateData.image = imageUrl;
    }

    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: unknown) {
    console.error("[SERVICE_BY_ID_PUT] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
});

export const DELETE = withAdminAuth(async (_req, context) => {
  try {
    await connectDB();
    const { id } = await (context.params as Promise<{ id: string }>);
    const service = await Service.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[SERVICE_BY_ID_DELETE] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
});
