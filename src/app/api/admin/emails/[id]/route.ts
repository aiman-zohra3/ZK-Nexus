import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminAuthenticated } from "@/app/lib/supabaseAdmin";

export async function DELETE(
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

    const { error } = await supabaseAdmin
      .from("email_inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete route error:", err);
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
}