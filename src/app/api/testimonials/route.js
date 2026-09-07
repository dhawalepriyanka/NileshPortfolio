import { NextResponse } from "next/server";
import { getAllTestimonials, createTestimonial, deleteTestimonial } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reviews = getAllTestimonials();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, rating, testimonial, loanType, location } = body;

    if (!name || !testimonial) {
      return NextResponse.json(
        { error: "Name and review testimonial are required" },
        { status: 400 }
      );
    }

    const review = createTestimonial({
      name: name.trim(),
      rating: Number(rating) || 5,
      testimonial: testimonial.trim(),
      loanType: loanType || "Home Loan",
      location: location ? location.trim() : "Navi Mumbai",
      date: new Date().toISOString().split("T")[0],
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    deleteTestimonial(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
