import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/app/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
        const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD is not set in the environment.");
      return NextResponse.json({ error: "Admin login is not configured." }, { status: 500 });
    }

    const { password } = await req.json();
    if (typeof password !== "string" || password !== adminPassword) {
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