import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getCloudinaryErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as Record<string, unknown>;
    if (typeof maybeError.message === "string" && maybeError.message) {
      return maybeError.message;
    }
    if (typeof maybeError.error === "object" && maybeError.error !== null) {
      const nested = maybeError.error as Record<string, unknown>;
      if (typeof nested.message === "string" && nested.message) {
        return nested.message;
      }
    }
  }

  return "Failed to upload image";
}

export async function uploadImage(fileStr: string, folder = "astroveda"): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars are missing on server.");
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder,
    });
    return uploadResponse.secure_url;
  } catch (error: unknown) {
    console.error("Cloudinary upload failed", error);
    throw new Error(getCloudinaryErrorMessage(error));
  }
}

export default cloudinary;
