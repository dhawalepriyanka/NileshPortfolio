import { NextResponse } from "next/server";
import { getDbStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getDbStatus();
    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        provider: "Local Vault",
        type: "local",
        status: "local",
        message: error.message || "Failed to check status",
        color: "#F59E0B",
      },
      { status: 200 }
    );
  }
}
