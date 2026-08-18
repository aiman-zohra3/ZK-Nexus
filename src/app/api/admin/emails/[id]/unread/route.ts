import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { error } = await supabaseAdmin
      .from("email_inquiries")
      .update({ is_read: false })
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}