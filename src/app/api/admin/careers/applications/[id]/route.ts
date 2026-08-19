import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    const { status } = await req.json();

    if (status !== "hired" && status !== "not_hired") {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const { data: application, error: fetchError } = await supabaseAdmin
      .from("job_applications")
      .select("id, name, email, role, opening_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // Guard against double-counting if this application was already decided.
    const alreadyDecided = application.status !== "pending";

    const { error: updateError } = await supabaseAdmin
      .from("job_applications")
      .update({ status, is_read: true })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // ---------- BUMP THE OPENING'S FILLED COUNT ON HIRE ----------
    if (status === "hired" && !alreadyDecided && application.opening_id) {
      const { data: opening, error: openingFetchError } = await supabaseAdmin
        .from("job_openings")
        .select("id, positions, filled, is_published")
        .eq("id", application.opening_id)
        .single();

      if (!openingFetchError && opening) {
        const newFilled = opening.filled + 1;
        const shouldClose = newFilled >= opening.positions;

        const { error: openingUpdateError } = await supabaseAdmin
          .from("job_openings")
          .update({
            filled: newFilled,
            // Auto-unpublish once every spot is filled — it'll show up under
            // "Closed" in the admin panel rather than staying live on the site.
            ...(shouldClose ? { is_published: false } : {}),
          })
          .eq("id", opening.id);

        if (openingUpdateError) {
          console.error("Failed to update opening fill count:", openingUpdateError);
        }
      } else if (openingFetchError) {
        console.error("Failed to fetch opening for fill count update:", openingFetchError);
      }
    }

    // ---------- NOTIFY THE APPLICANT (best-effort, never fails the request) ----------
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const isHired = status === "hired";
      const subject = isHired
        ? `You're hired — ${application.role} at ZK Nexus`
        : `Update on your application — ${application.role} at ZK Nexus`;
      const text = isHired
        ? `Hi ${application.name},\n\nCongratulations! We'd like to move forward with your application for the ${application.role} role. We'll be in touch shortly with next steps.\n\n— ZK Nexus`
        : `Hi ${application.name},\n\nThank you for applying for the ${application.role} role. After careful review, we've decided to move forward with other candidates at this time. We appreciate your interest in ZK Nexus and encourage you to apply again in the future.\n\n— ZK Nexus`;

      await transporter.sendMail({
        from: `"ZK Nexus" <${process.env.GMAIL_USER}>`,
        to: application.email,
        subject,
        text,
        html: `<p>${text.replace(/\n/g, "<br/>")}</p>`,
      });
    } catch (mailErr) {
      console.error("Applicant status email failed:", mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Application status update error:", err);
    return NextResponse.json({ error: "Failed to update application." }, { status: 500 });
  }
}