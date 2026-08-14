import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { resolveMx } from "dns/promises";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s]+$/;
const MESSAGE_HAS_LETTERS = /[a-zA-Z]/;

const validServices = [
  "Website Development",
  "UI / UX Design",
  "Cyber Security",
  "Not sure yet",
];

const validBudgets = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
];

async function domainHasMailServer(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  if (!domain) return false;

  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    // No MX records found, or DNS lookup failed — treat as invalid
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, service, budget, message } = await req.json();

    // ---------- FIELD VALIDATION ----------

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid name." },
        { status: 400 }
      );
    }

    if (!NAME_REGEX.test(name.trim())) {
      return NextResponse.json(
        { error: "Name contains invalid characters." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (company && typeof company === "string" && company.trim().length > 0 && company.trim().length < 2) {
      return NextResponse.json(
        { error: "Company name looks too short." },
        { status: 400 }
      );
    }
    if (!MESSAGE_HAS_LETTERS.test(message)) {
  return NextResponse.json(
    { error: "Message must contain some actual text, not just numbers or symbols." },
    { status: 400 }
  );
}

    if (!service || !validServices.includes(service)) {
      return NextResponse.json(
        { error: "Please select a valid service." },
        { status: 400 }
      );
    }

    if (!budget || !validBudgets.includes(budget)) {
      return NextResponse.json(
        { error: "Please select a budget range." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a bit more detail in your message." },
        { status: 400 }
      );
    }

    // ---------- EMAIL DOMAIN VERIFICATION ----------

    const hasMailServer = await domainHasMailServer(email.trim());
    if (!hasMailServer) {
      return NextResponse.json(
        { error: "This email domain doesn't appear to accept mail — please double-check it." },
        { status: 400 }
      );
    }

    // ---------- SEND EMAIL ----------

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
      replyTo: email,
      subject: `New inquiry from ${name} — ${service}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || "N/A"}
Service: ${service}
Budget: ${budget}

Message:
${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}