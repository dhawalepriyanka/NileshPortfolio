import { NextResponse } from "next/server";
import { writeFile, readdir, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const files = await readdir(uploadDir);
    const images = files.map((f) => ({
      name: f,
      url: `/uploads/${f}`,
    }));
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error reading uploads:", error);
    return NextResponse.json([]);
  }
}
