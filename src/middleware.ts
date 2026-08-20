import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session";
const LOGIN_PATH = "/admin/xyz-zk";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated =
    req.cookies.get(ADMIN_COOKIE_NAME)?.value === "authenticated";

  // The login page now lives at /admin/xyz-zk, not /admin.
  if (pathname === LOGIN_PATH) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/emails", req.url));
    }
    return NextResponse.next();
  }

  // Everything else under /admin/ (including bare /admin, which no longer
  // has a page and will 404) requires auth, redirecting to the hidden login path.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};