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
    const { name, email, subject, message } = await req.json();

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
    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json({ error: "Please provide a subject." }, { status: 400 });
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

    // ---------- DUPLICATE CHECK ----------
    const { data: existingInquiry, error: dupCheckError } = await supabaseAdmin
      .from("email_inquiries")
      .select("id")
      .eq("email", email.trim())
      .maybeSingle();

    if (dupCheckError) {
      console.error("Duplicate inquiry check error:", dupCheckError);
    } else if (existingInquiry) {
      return NextResponse.json(
        { error: "We already have a message on file from this email — we'll get back to you soon." },
        { status: 409 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    // ---------- SAVE TO SUPABASE (source of truth) ----------

    const { error: dbError } = await supabaseAdmin.from("email_inquiries").insert({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }

    

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email-us form error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}