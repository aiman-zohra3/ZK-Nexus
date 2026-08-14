import nodemailer from "nodemailer";
import { resolveMx } from "dns/promises";

// ======================================================
// Shared lead-email sender.
// Used by /api/chat/lead (structured form) AND
// /api/chat (Gemini function calling) so both paths send
// the exact same email through the exact same checks.
// ======================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadInput {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  topic?: string;
}

type LeadResult = { ok: true } | { ok: false; error: string };

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

export async function sendLeadEmail({
  name,
  email,
  phone,
  message,
  topic,
}: LeadInput): Promise<LeadResult> {
  if (!name || name.trim().length < 2) {
    return { ok: false, error: "Please share your name." };
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return { ok: false, error: "Please share a valid email." };
  }

  const hasMailServer = await domainHasMailServer(email.trim());
  if (!hasMailServer) {
    return {
      ok: false,
      error: "That email domain doesn't look right — please double-check it.",
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"ZK Nexus Chatbot" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `New chat lead from ${name}${topic ? ` — ${topic}` : ""}`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Topic: ${topic || "N/A"}

Message:
${message || "(no message left)"}
    `,
    html: `
      <h2>New chatbot lead</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Topic:</strong> ${topic || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${(message || "(no message left)").replace(/\n/g, "<br/>")}</p>
    `,
  });

  return { ok: true };
}