import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

export async function GET(
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

    const { data, error } = await supabaseAdmin
      .from("email_replies")
      .select("id, message, created_at")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ replies: data ?? [] });
  } catch (err) {
    console.error("Fetch replies error:", err);
    return NextResponse.json({ error: "Failed to fetch replies." }, { status: 500 });
  }
}