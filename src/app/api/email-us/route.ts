import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { resolveMx } from "dns/promises";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;
const MESSAGE_HAS_LETTERS = /[a-zA-Z]/;

async function domainHasMailServer(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  if (!domain) return false;
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // ---------- VALIDATION ----------

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please provide a valid name." }, { status: 400 });
    }
    if (!NAME_REGEX.test(name.trim())) {
      return NextResponse.json({ error: "Name contains invalid characters." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a bit more detail in your message." },
        { status: 400 }
      );
    }
    if (!MESSAGE_HAS_LETTERS.test(message)) {
      return NextResponse.json(
        { error: "Message must contain some actual text, not just numbers or symbols." },
        { status: 400 }
      );
    }

    const hasMailServer = await domainHasMailServer(email.trim());
    if (!hasMailServer) {
      return NextResponse.json(
        { error: "This email domain doesn't appear to accept mail — please double-check it." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    // ---------- SAVE TO SUPABASE (source of truth) ----------

    const { error: dbError } = await supabaseAdmin.from("email_inquiries").insert({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }

    // ---------- SEND EMAIL (best-effort — record is already saved) ----------

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"ZK Nexus Website" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: trimmedEmail,
        subject: `New quick inquiry from ${trimmedName}`,
        text: `
Name: ${trimmedName}
Email: ${trimmedEmail}

Message:
${trimmedMessage}
        `,
        html: `
          <h2>New Quick Inquiry</h2>
          <p><strong>Name:</strong> ${trimmedName}</p>
          <p><strong>Email:</strong> ${trimmedEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${trimmedMessage.replace(/\n/g, "<br/>")}</p>
        `,
      });
    } catch (mailErr) {
      // Don't fail the request — the inquiry is already safely stored.
      console.error("Email send error (message was still saved):", mailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email-us form error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}