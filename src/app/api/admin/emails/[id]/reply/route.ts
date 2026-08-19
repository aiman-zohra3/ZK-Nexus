import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params; // ← await params in Next.js 15

    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Reply message can't be empty." }, { status: 400 });
    }

    const trimmedMessage = message.trim();

    // ---------- LOOK UP THE ORIGINAL INQUIRY ----------

    const { data: inquiry, error: fetchError } = await supabaseAdmin
      .from("email_inquiries")
      .select("id, name, email, subject")
      .eq("id", id)
      .single();

    if (fetchError || !inquiry) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    // ---------- SEND THE REPLY VIA GMAIL ----------

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const replySubject = inquiry.subject
      ? `Re: ${inquiry.subject}`
      : `Re: your inquiry to ZK Nexus`;

    try {
      await transporter.sendMail({
        from: `"ZK Nexus" <${process.env.GMAIL_USER}>`,
        to: inquiry.email,
        replyTo: process.env.GMAIL_USER,
        subject: replySubject,
        text: trimmedMessage,
        html: `<p>${trimmedMessage.replace(/\n/g, "<br/>")}</p>`,
      });
    } catch (mailErr) {
      console.error("Reply email send error:", mailErr);
      return NextResponse.json(
        { error: "Failed to send the reply email. Please try again." },
        { status: 500 }
      );
    }

    // ---------- MARK AS REPLIED ----------

    const { error: updateError } = await supabaseAdmin
      .from("email_inquiries")
      .update({ replied: true, replied_at: new Date().toISOString(), is_read: true })
      .eq("id", id);

    if (updateError) {
      // Email already sent successfully — don't fail the request over this.
      console.error("Failed to mark inquiry as replied:", updateError);
    }
    // ---------- SAVE REPLY TO HISTORY ----------

    const { error: insertError } = await supabaseAdmin
      .from("email_replies")
      .insert({ inquiry_id: id, message: trimmedMessage });

    if (insertError) {
      // Email already sent — don't fail the request over history logging.
      console.error("Failed to save reply history:", insertError);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reply route error:", err);
    return NextResponse.json({ error: "Failed to send reply." }, { status: 500 });
  }
  
}