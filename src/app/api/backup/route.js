import { NextResponse } from "next/server";
import { getDatabaseExport, restoreDatabaseImport } from "@/lib/db";

export async function GET() {
  try {
    const data = getDatabaseExport();
    const jsonStr = JSON.stringify(data, null, 2);
    return new NextResponse(jsonStr, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="nileshkute_portfolio_backup_${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Backup export error:", error);
    return NextResponse.json({ error: "Failed to export backup" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.leads && !data.blogs && !data.settings) {
      return NextResponse.json({ error: "Invalid backup format" }, { status: 400 });
    }
    restoreDatabaseImport(data);
    return NextResponse.json({ success: true, message: "Database restored successfully" });
  } catch (error) {
    console.error("Backup restore error:", error);
    return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 });
  }
}
