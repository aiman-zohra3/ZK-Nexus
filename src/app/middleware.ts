import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated =
    req.cookies.get(ADMIN_COOKIE_NAME)?.value === "authenticated";

  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/emails", req.url));
    }
    return NextResponse.next();
  }

  // Covers /admin AND /admin/*
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Added "/admin" alongside "/admin/:path*"
  matcher: ["/admin", "/admin/:path*"],
};