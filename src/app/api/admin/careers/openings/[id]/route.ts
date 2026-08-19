import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

const DEPTS = ["Engineering", "Security", "Design", "Operations"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      title,
      dept,
      type,
      location,
      positions,
      filled,
      description,
      requirements,
      postedAt,
      isPublished,
    } = body;

    const updates: Record<string, unknown> = {};

    // Publish/unpublish toggle can be sent alone, with no other fields.
    if (typeof isPublished === "boolean") {
      updates.is_published = isPublished;
    }

    // Full-edit fields — only validate/apply the ones that were actually sent.
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return NextResponse.json({ error: "Title is required." }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (dept !== undefined) {
      if (!DEPTS.includes(dept)) {
        return NextResponse.json({ error: "Invalid department." }, { status: 400 });
      }
      updates.dept = dept;
    }

    if (type !== undefined) {
      if (!TYPES.includes(type)) {
        return NextResponse.json({ error: "Invalid job type." }, { status: 400 });
      }
      updates.type = type;
    }

    if (location !== undefined) {
      if (typeof location !== "string" || !location.trim()) {
        return NextResponse.json({ error: "Location is required." }, { status: 400 });
      }
      updates.location = location.trim();
    }

    if (positions !== undefined) {
      const positionsNum = Number(positions);
      if (!Number.isFinite(positionsNum) || positionsNum < 1) {
        return NextResponse.json({ error: "Positions must be at least 1." }, { status: 400 });
      }
      updates.positions = positionsNum;
    }

    if (filled !== undefined) {
      const filledNum = Number(filled);
      if (!Number.isFinite(filledNum) || filledNum < 0) {
        return NextResponse.json({ error: "Filled cannot be negative." }, { status: 400 });
      }
      updates.filled = filledNum;
    }

    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    if (requirements !== undefined) {
      updates.requirements = Array.isArray(requirements) ? requirements.filter(Boolean) : [];
    }

    if (postedAt !== undefined) {
      updates.posted_at = postedAt || new Date().toISOString().slice(0, 10);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("job_openings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ opening: data });
  } catch (err) {
    console.error("Update opening error:", err);
    return NextResponse.json({ error: "Failed to update opening." }, { status: 500 });
  }
}