import { NextResponse } from "next/server";
import { createLead, getAllLeads, updateLead, deleteLead } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, mobile, loanType, message, email, employmentType, loanAmount, city, source } = body;

    if (!name || !mobile || !loanType) {
      return NextResponse.json(
        { error: "Name, mobile, and loan type are required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const lead = createLead({
      name,
      phone: mobile,
      loanType,
      notes: message,
      email,
      employmentType,
      loanAmount,
      city,
      source: source || "Website",
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }
    updateLead(id, status, notes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    deleteLead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
