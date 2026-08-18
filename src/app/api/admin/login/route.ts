import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/app/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (typeof password !== "string" || password !== (process.env.ADMIN_PASSWORD ?? "12345")) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}