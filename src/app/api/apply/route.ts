import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;
const URL_REGEX = /^https?:\/\/[^\s]+\.[^\s]+$/;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const portfolio = formData.get("portfolio")?.toString().trim() || "";
    const role = formData.get("role")?.toString().trim();
    const department = formData.get("department")?.toString().trim() || "";
    const openingId = formData.get("openingId")?.toString().trim() || "";
    const resume = formData.get("resume") as File | null;

    // ---------- FIELD VALIDATION ----------

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please provide a valid name." }, { status: 400 });
    }
    if (!NAME_REGEX.test(name)) {
      return NextResponse.json({ error: "Name can only contain letters and spaces." }, { status: 400 });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (portfolio && !URL_REGEX.test(portfolio)) {
      return NextResponse.json({ error: "Portfolio must be a valid URL." }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json({ error: "Missing role information." }, { status: 400 });
    }
    if (!resume) {
      return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
    }
    if (resume.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Resume file exceeds the 5MB limit." }, { status: 400 });
    }
       if (!ALLOWED_TYPES.includes(resume.type)) {
      return NextResponse.json({ error: "Resume must be a PDF or Word document." }, { status: 400 });
    }

    // ---------- DUPLICATE CHECK ----------
    // Same email can apply to different roles, but not the same opening twice.
    if (openingId) {
      const { data: existing, error: dupCheckError } = await supabaseAdmin
        .from("job_applications")
        .select("id")
        .eq("email", email)
        .eq("opening_id", openingId)
        .maybeSingle();

      if (dupCheckError) {
        console.error("Duplicate application check error:", dupCheckError);
      } else if (existing) {
        return NextResponse.json(
          { error: "An application already exists with this email address." },
          { status: 409 }
        );
      }
    }

    // ---------- UPLOAD RESUME TO STORAGE ----------

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const safeFileName = resume.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const storagePath = `applications/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("resumes")
      .upload(storagePath, resumeBuffer, {
        contentType: resume.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Resume upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload resume." }, { status: 500 });
    }

    // ---------- INSERT APPLICATION ----------

    const { error: insertError } = await supabaseAdmin.from("job_applications").insert({
      opening_id: openingId || null,
      name,
      email,
      portfolio: portfolio || null,
      role,
      department: department || null,
      resume_path: storagePath,
      resume_filename: resume.name,
    });

    if (insertError) {
      console.error("Application insert error:", insertError);
      await supabaseAdmin.storage.from("resumes").remove([storagePath]);
      return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Application submission error:", err);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}