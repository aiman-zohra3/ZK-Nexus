import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

const DEPTS = ["Engineering", "Security", "Design", "Operations"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const TITLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Developer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
  "Penetration Tester",
  "UI/UX Designer",
  "Project Manager",
];
const LOCATION_REGEX = /^[a-zA-Z À-ÖØ-öø-ÿ,.\-]{2,100}$/;
const HAS_LETTERS = /[a-zA-Z]/;


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
      if (!TITLES.includes(title)) {
        return NextResponse.json({ error: "Invalid job title." }, { status: 400 });
      }
      updates.title = title;
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
      const trimmedLocation = location.trim();
      if (!LOCATION_REGEX.test(trimmedLocation)) {
        return NextResponse.json({ error: "Location contains invalid characters." }, { status: 400 });
      }
      updates.location = trimmedLocation;
    }

    if (positions !== undefined) {
      const positionsNum = Number(positions);
      if (!Number.isInteger(positionsNum) || positionsNum < 1) {
        return NextResponse.json({ error: "Positions must be a whole number of at least 1." }, { status: 400 });
      }
      updates.positions = positionsNum;
    }

    if (filled !== undefined) {
      const filledNum = Number(filled);
      if (!Number.isInteger(filledNum) || filledNum < 0) {
        return NextResponse.json({ error: "Filled cannot be negative." }, { status: 400 });
      }
      updates.filled = filledNum;
    }

    // Cross-check filled vs positions whenever either one is being changed in this request.
    if (positions !== undefined || filled !== undefined) {
      const finalPositions =
        (updates.positions as number | undefined) ?? (positions !== undefined ? Number(positions) : undefined);
      const finalFilled =
        (updates.filled as number | undefined) ?? (filled !== undefined ? Number(filled) : undefined);

      if (typeof finalPositions === "number" && typeof finalFilled === "number" && finalFilled > finalPositions) {
        return NextResponse.json({ error: "Filled cannot exceed positions." }, { status: 400 });
      }
    }

    if (description !== undefined) {
      const trimmedDescription = typeof description === "string" ? description.trim() : "";
      if (!trimmedDescription) {
        return NextResponse.json({ error: "Description is required." }, { status: 400 });
      }
      if (trimmedDescription.length < 10) {
        return NextResponse.json({ error: "Description should be at least 10 characters." }, { status: 400 });
      }
      if (!HAS_LETTERS.test(trimmedDescription)) {
        return NextResponse.json({ error: "Description must contain actual text." }, { status: 400 });
      }
      updates.description = trimmedDescription;
    }

    if (requirements !== undefined) {
      const requirementLines = Array.isArray(requirements)
        ? requirements.map((r) => String(r).trim()).filter(Boolean)
        : [];
      if (requirementLines.length === 0) {
        return NextResponse.json({ error: "At least one requirement is needed." }, { status: 400 });
      }
      if (requirementLines.some((line) => line.length < 3 || !HAS_LETTERS.test(line))) {
        return NextResponse.json({ error: "Each requirement must be at least 3 characters of actual text." }, { status: 400 });
      }
      updates.requirements = requirementLines;
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