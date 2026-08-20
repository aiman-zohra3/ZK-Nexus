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
export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("job_openings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ openings: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, dept, type, location, positions, filled, description, requirements, postedAt } = body;

        if (!TITLES.includes(title)) {
      return NextResponse.json({ error: "Invalid job title." }, { status: 400 });
    }

    if (!DEPTS.includes(dept)) {
      return NextResponse.json({ error: "Invalid department." }, { status: 400 });
    }
    if (!TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid job type." }, { status: 400 });
    }

    if (!location || typeof location !== "string" || !location.trim()) {
      return NextResponse.json({ error: "Location is required." }, { status: 400 });
    }
    const trimmedLocation = location.trim();
    if (!LOCATION_REGEX.test(trimmedLocation)) {
      return NextResponse.json({ error: "Location contains invalid characters." }, { status: 400 });
    }

    const positionsNum = Number(positions);
    const filledNum = Number(filled ?? 0);

    if (!Number.isInteger(positionsNum) || positionsNum < 1) {
      return NextResponse.json({ error: "Positions must be a whole number of at least 1." }, { status: 400 });
    }
    if (!Number.isInteger(filledNum) || filledNum < 0) {
      return NextResponse.json({ error: "Filled cannot be negative." }, { status: 400 });
    }
    if (filledNum > positionsNum) {
      return NextResponse.json({ error: "Filled cannot exceed positions." }, { status: 400 });
    }

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

    const requirementLines = Array.isArray(requirements)
      ? requirements.map((r) => String(r).trim()).filter(Boolean)
      : [];
    if (requirementLines.length === 0) {
      return NextResponse.json({ error: "At least one requirement is needed." }, { status: 400 });
    }
    if (requirementLines.some((line) => line.length < 3 || !HAS_LETTERS.test(line))) {
      return NextResponse.json({ error: "Each requirement must be at least 3 characters of actual text." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("job_openings")
            .insert({
        title,
        dept,
        type,
        location: trimmedLocation,
        positions: positionsNum,
        filled: filledNum,
        description: trimmedDescription ,
        requirements: requirementLines,
        posted_at: postedAt || new Date().toISOString().slice(0, 10),
        is_published: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ opening: data });
  } catch (err) {
    console.error("Create opening error:", err);
    return NextResponse.json({ error: "Failed to create opening." }, { status: 500 });
  }
}