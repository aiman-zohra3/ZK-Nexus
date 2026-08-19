import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import EmailsClient from "./EmailsClient";

export const dynamic = "force-dynamic";

export type EmailInquiry = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  replied: boolean;
  replied_at: string | null;
  created_at: string;
};

export default async function AdminEmailsPage() {
  const { data, error } = await supabaseAdmin
    .from("email_inquiries")
    .select("id, name, email, subject, message, is_read, replied, replied_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load email_inquiries:", error);
    return (
      <div className="p-8">
        <p className="text-red-400">Failed to load emails: {error.message}</p>
        <p className="mt-2 text-sm text-white/40">
          If this mentions a missing column, run the Supabase migration that adds
          `subject`, `replied`, and `replied_at` to `email_inquiries`.
        </p>
      </div>
    );
  }

  return <EmailsClient initialEmails={(data ?? []) as EmailInquiry[]} />;
}