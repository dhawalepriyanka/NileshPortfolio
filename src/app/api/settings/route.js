import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllSettings, setSetting } from "@/lib/db";

export async function GET() {
  try {
    const settings = getAllSettings();
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate"
      }
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    for (const [key, val] of Object.entries(body)) {
      setSetting(key, val);
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true }, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate"
      }
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
