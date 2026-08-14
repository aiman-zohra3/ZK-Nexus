import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, FunctionDeclaration } from "@google/genai";
import { sendLeadEmail } from "@/app/lib/sendLead";
import { chatRatelimit, getClientIp } from "@/app/lib/rateLimit";
import { projects } from "@/data/projects";
import { openJobs, remainingSpots } from "@/data/jobs";
import { values, principles, team, stats, storyTexts, missionText } from "@/data/about";
import { sections as privacySections, intro as privacyIntro, lastUpdated as privacyLastUpdated, contactEmail as privacyEmail } from "@/data/privacy";

// ======================================================
// POST /api/chat
// Takes the running message history and returns the bot's
// next reply, generated via the Gemini API. Used for
// free-typed messages (quick-reply buttons use canned
// responses client-side and never hit this route).
//
// Rate limited per IP before anything else runs, so a
// scripted flood never reaches the Gemini call.
//
// Gemini can call the submitLead function when a visitor
// gives their name + email in free text — that's the only
// thing that actually sends the lead email from this route.
//
// The system prompt also gets a live summary of everything
// in data/projects.ts and the currently-open roles from
// data/jobs.ts appended on every request, so the bot only
// ever talks about what's actually on the site — nothing
// hardcoded, nothing invented.
// ======================================================

const BASE_SYSTEM_PROMPT = `You are the website assistant for ZK Nexus, a web development and cybersecurity studio.

What ZK Nexus does:
- Custom web development: Next.js / React / full-stack builds, from scratch or on existing codebases.
- UI/UX design.
- Cybersecurity: audits, hardening, monitoring.

Your job:
- Answer visitor questions about services, process, and general scoping in 2-4 short sentences.
- Never invent exact prices — pricing depends on scope, so direct pricing questions toward booking a quick scoping call.
- When asked about past work or projects, only describe projects listed in the "Projects ZK Nexus has built" section below. Summarize them in your own words rather than reciting them verbatim. If someone asks about a project that isn't listed there, say you don't have details on that one and offer to connect them with the team.
- When asked about jobs, careers, or hiring, only mention roles listed in the "Open positions" section below. If a role isn't listed there, it isn't currently open — say so rather than guessing. If someone is interested in a role, ask for their name and email, and once you have both, call the submitLead function with the role title included in the message field.
- If someone wants to start a project, get a quote, or talk to a human, ask for their name and email (phone optional). Once you have at least their name and email, call the submitLead function with that information. Do not tell the visitor their details have been sent to the team unless you have actually called submitLead — the function call is what really notifies the team, not your reply text.
- Keep replies short, plain, and conversational. No markdown headers, no bullet lists unless truly helpful.
- If asked something totally unrelated to ZK Nexus or web/security work, politely redirect back to what ZK Nexus can help with.
- For questions about the company, mission, values, team, or stats, answer from the "About ZK Nexus" section below.
- For questions about privacy, data handling, or the privacy policy, answer from the "Privacy Policy" section below. Don't guess at legal specifics not listed there — point them to the full policy at /privacy-policy instead.`;

function buildProjectsContext(): string {
  return projects
    .map((p) => {
      const stack = p.stack.join(", ");
      const summary = p.description ?? p.solution;
      return `- ${p.name} (${p.category}, built with ${stack}): ${p.landingLine} ${summary}`;
    })
    .join("\n\n");
}

function buildJobsContext(): string {
  if (openJobs.length === 0) {
    return "There are no open positions right now.";
  }

  return openJobs
    .map((job) => {
      const spots = remainingSpots(job);
      const reqs = job.requirements?.length
        ? ` Requirements: ${job.requirements.join("; ")}.`
        : "";
      return `- ${job.title} (${job.dept}, ${job.type}, ${job.location}) — ${spots} spot${
        spots === 1 ? "" : "s"
      } open. ${job.description ?? ""}${reqs}`;
    })
    .join("\n\n");
}

function buildAboutContext(): string {
  const valuesStr = values.map((v) => `- ${v.title}: ${v.description}`).join("\n");

  const principlesStr = principles
    .map((p) => `${p.number}. ${p.title} — ${p.description}`)
    .join("\n");

  const teamStr = team.map((m) => `- ${m.name} (${m.role}): ${m.bio}`).join("\n");

  const statsStr = stats.map((s) => `${s.value}${s.suffix} ${s.title}`).join(", ");

  return `Mission: ${missionText}

Story: ${storyTexts.join(" ")}

Values:
${valuesStr}

What we stand for:
${principlesStr}

Team:
${teamStr}

Stats: ${statsStr}`;
}

function buildPrivacyContext(): string {
  const body = privacySections
    .map((s) => {
      const blocks = s.content
        .map((b) => {
          const list = b.list.length ? "\n  " + b.list.join("\n  ") : "";
          return `${b.heading ? b.heading + ": " : ""}${b.body}${list}`;
        })
        .join("\n");
      return `${s.number}. ${s.title}\n${blocks}`;
    })
    .join("\n\n");

  return `Last updated: ${privacyLastUpdated}. Full policy at /privacy-policy. Contact: ${privacyEmail}.

${privacyIntro}

${body}`;
}


interface IncomingMessage {
  role: "user" | "bot";
  text: string;
}

const submitLeadDeclaration: FunctionDeclaration = {
  name: "submitLead",
  description:
    "Send a visitor's contact details to the ZK Nexus team so someone can follow up. Call this once you have at least the visitor's name and email — whether they want a quote, want to start a project, ask to be contacted, or are applying for an open role.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Visitor's full name." },
      email: { type: "string", description: "Visitor's email address." },
      phone: {
        type: "string",
        description: "Visitor's phone number, if they gave one.",
      },
      message: {
        type: "string",
        description:
          "A short summary of what the visitor needs help with, or which role they're applying for.",
      },
    },
    required: ["name", "email"],
  },
};

export async function POST(req: NextRequest) {
  try {
    // ---- Rate limit first, before touching Gemini at all ----
    const ip = getClientIp(req);
    const { success, reset } = await chatRatelimit.limit(ip);

    if (!success) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );
      return NextResponse.json(
        {
          error:
            "You're sending messages a bit fast — give it a few seconds and try again.",
        },
        {
          status: 429,
          headers: { "Retry-After": retryAfterSeconds.toString() },
        }
      );
    }

    const { messages } = (await req.json()) as { messages: IncomingMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 }
      );
    }

    // Cap history sent upstream — keep last 12 turns
    const recent = messages.slice(-12);

    // Gemini uses "user" / "model" roles and a parts[] array per turn
    const contents = recent.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "Chat is temporarily unavailable." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `${BASE_SYSTEM_PROMPT}

Projects ZK Nexus has built:
${buildProjectsContext()}

Open positions:
${buildJobsContext()}

About ZK Nexus:
${buildAboutContext()}

Privacy Policy:
${buildPrivacyContext()}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 300,
        tools: [{ functionDeclarations: [submitLeadDeclaration] }],
      },
    });

    // If the model decided it has enough info, it calls submitLead instead
    // of (or alongside) replying with text. Handle that first.
    const call = response.functionCalls?.[0];

    if (call?.name === "submitLead") {
      const args = call.args as {
        name?: string;
        email?: string;
        phone?: string;
        message?: string;
      };

      const result = await sendLeadEmail({
        name: args.name,
        email: args.email,
        phone: args.phone,
        message: args.message,
        topic: "Website chat",
      });

      const reply = result.ok
        ? `Thanks${args.name ? ` ${args.name}` : ""}! I've sent your details over to the team — they'll reach out to you at ${args.email} shortly.`
        : `I couldn't quite get that sent through (${result.error}). Mind double-checking, or tapping "Talk to us" instead?`;

      return NextResponse.json({ reply });
    }

    const reply =
      response.text?.trim() ||
      "Sorry, I couldn't put a reply together just now. Could you try rephrasing that?";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}