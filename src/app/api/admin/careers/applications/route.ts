import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("job_applications")
    .select(
      "id, opening_id, name, email, portfolio, role, department, resume_path, resume_filename, is_read, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Attach a short-lived signed URL for each resume so the admin can open/download it.
  const applications = await Promise.all(
    (data ?? []).map(async (app) => {
      let resumeUrl: string | null = null;

      if (app.resume_path) {
        const { data: signed, error: signError } = await supabaseAdmin.storage
          .from("resumes")
          .createSignedUrl(app.resume_path, 3600); // 1 hour

        if (!signError) {
          resumeUrl = signed?.signedUrl ?? null;
        } else {
          console.error("Signed URL error for", app.resume_path, signError);
        }
      }

      return { ...app, resume_url: resumeUrl };
    })
  );

  return NextResponse.json({ applications });
}