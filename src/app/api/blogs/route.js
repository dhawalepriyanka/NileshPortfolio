import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from "@/lib/db";

export async function GET() {
  try {
    const blogs = getAllBlogs();
    return NextResponse.json(blogs, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json({ error: "Title, excerpt, and content are required" }, { status: 400 });
    }
    const result = createBlog(body);
    revalidatePath("/", "layout");
    revalidatePath("/blog");
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    if (!body.id || !body.title) {
      return NextResponse.json({ error: "ID and title required" }, { status: 400 });
    }
    updateBlog(body.id, body);
    revalidatePath("/", "layout");
    revalidatePath("/blog");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    deleteBlog(id);
    revalidatePath("/", "layout");
    revalidatePath("/blog");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
