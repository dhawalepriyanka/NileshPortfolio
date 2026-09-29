import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllTestimonials, createTestimonial, deleteTestimonial } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const reviews = await getAllTestimonials();
    return NextResponse.json(reviews, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, rating, testimonial, loanType, location, date } = body;

    if (!name || !testimonial) {
      return NextResponse.json(
        { error: "Name and review testimonial are required" },
        { status: 400 }
      );
    }

    const review = await createTestimonial({
      id: body.id,
      name: name.trim(),
      rating: Number(rating) || 5,
      testimonial: testimonial.trim(),
      loanType: loanType || "Home Loan",
      location: location ? location.trim() : "Navi Mumbai",
      date: date || new Date().toISOString().split("T")[0],
    });

    try {
      revalidatePath("/reviews");
      revalidatePath("/admin");
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("revalidatePath warning:", e);
    }

    return NextResponse.json({ success: true, data: review }, {
      status: 201,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const text = searchParams.get("text");
    if (!id && !name && !text) {
      return NextResponse.json({ error: "ID, name, or text is required" }, { status: 400 });
    }

    await deleteTestimonial(id, name, text);

    try {
      revalidatePath("/reviews");
      revalidatePath("/admin");
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("revalidatePath warning:", e);
    }

    return NextResponse.json({ success: true }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
