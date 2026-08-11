import { NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/lib/db";

export async function GET() {
  try {
    const settings = getAllSettings();
    return NextResponse.json(settings);
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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
