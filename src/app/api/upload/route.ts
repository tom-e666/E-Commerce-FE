import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { File } from "formidable";
// import { readFile } from "fs/promises";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Tắt bodyParser mặc định
export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  // Parse form data
  // const form = formidable();
  // const buffers: Buffer[] = [];

  // formidable không hỗ trợ Next.js app router trực tiếp, nên ta dùng workaround:
  const data = await req.formData();
  const file = data.get("file") as File | null;
  const folder = data.get("folder") as string | null;
  const public_id = data.get("public_id") as string | null;

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Đọc file buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload lên Cloudinary
  try {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder || "product/unknown",
          public_id: public_id || undefined,
          resource_type: "image",
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}