import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated =
    req.cookies.get(ADMIN_COOKIE_NAME)?.value === "authenticated";

  // /admin is the login page itself
  if (pathname === "/admin") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/emails", req.url));
    }
    return NextResponse.next();
  }

  // Protect everything under /admin/
  if (pathname.startsWith("/admin/")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};