import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
    const department = formData.get("department")?.toString().trim();
    const resume = formData.get("resume") as File | null;

    // ---------- FIELD VALIDATION ----------

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid name." },
        { status: 400 }
      );
    }

    if (!NAME_REGEX.test(name)) {
      return NextResponse.json(
        { error: "Name can only contain letters and spaces." },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (portfolio && !URL_REGEX.test(portfolio)) {
      return NextResponse.json(
        { error: "Portfolio must be a valid URL." },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { error: "Missing role information." },
        { status: 400 }
      );
    }

    if (!resume) {
      return NextResponse.json(
        { error: "Resume file is required." },
        { status: 400 }
      );
    }

    if (resume.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file exceeds the 5MB limit." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(resume.type)) {
      return NextResponse.json(
        { error: "Resume must be a PDF or Word document." },
        { status: 400 }
      );
    }

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"ZK Nexus Careers" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New application: ${role} — ${name}`,
      text: `
Name: ${name}
Email: ${email}
Portfolio: ${portfolio || "N/A"}
Role: ${role}
Department: ${department}
      `,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Portfolio:</strong> ${portfolio || "N/A"}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Department:</strong> ${department}</p>
      `,
      attachments: [
        {
          filename: resume.name,
          content: resumeBuffer,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Application submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 }
    );
  }
}