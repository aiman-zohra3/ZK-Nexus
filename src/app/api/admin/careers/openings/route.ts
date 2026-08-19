import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

const DEPTS = ["Engineering", "Security", "Design", "Operations"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

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

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
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

    const positionsNum = Number(positions);
    const filledNum = Number(filled ?? 0);

    if (!Number.isFinite(positionsNum) || positionsNum < 1) {
      return NextResponse.json({ error: "Positions must be at least 1." }, { status: 400 });
    }
    if (!Number.isFinite(filledNum) || filledNum < 0) {
      return NextResponse.json({ error: "Filled cannot be negative." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("job_openings")
      .insert({
        title: title.trim(),
        dept,
        type,
        location: location.trim(),
        positions: positionsNum,
        filled: filledNum,
        description: description?.trim() || null,
        requirements: Array.isArray(requirements) ? requirements.filter(Boolean) : [],
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