import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

// ─── Supabase server client ───────────────────────────────────────────────────

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

// ─── Admin auth helper (merged from lib/adminAuth.ts) ─────────────────────────

export const ADMIN_COOKIE_NAME = "admin_session";

export function isAdminAuthenticated(req: NextRequest): boolean {
  return req.cookies.get(ADMIN_COOKIE_NAME)?.value === "authenticated";
}