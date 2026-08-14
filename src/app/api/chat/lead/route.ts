import { NextRequest, NextResponse } from "next/server";
import { sendLeadEmail } from "@/app/lib/sendLead";
import { leadRatelimit, getClientIp } from "@/app/lib/rateLimit";

// ======================================================
// POST /api/chat/lead
// Captures a lead from the chat widget's "Talk to us" flow
// and emails it to the team. Shares the same sending logic
// as /api/chat (used there for Gemini function calls), so
// both paths behave identically.
//
// Rate limited per IP so spam submissions can't flood the
// inbox or burn through Gmail's send quota.
// ======================================================

interface LeadRequestBody {
  name?: string;
  email?: string;
  message?: string;
  topic?: string;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { success, reset } = await leadRatelimit.limit(ip);

    if (!success) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );
      return NextResponse.json(
        {
          error:
            "Too many submissions from this device recently — please try again in a bit.",
        },
        {
          status: 429,
          headers: { "Retry-After": retryAfterSeconds.toString() },
        }
      );
    }

    const { name, email, message, topic } = (await req.json()) as LeadRequestBody;

    const result = await sendLeadEmail({ name, email, message, topic });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Chat lead route error:", err);
    return NextResponse.json(
      { error: "Failed to send your message." },
      { status: 500 }
    );
  }
}