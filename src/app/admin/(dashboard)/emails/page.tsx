import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import EmailsClient from "./EmailsClient";

export const dynamic = "force-dynamic";

export type EmailInquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default async function AdminEmailsPage() {
  const { data, error } = await supabaseAdmin
    .from("email_inquiries")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400">Failed to load emails: {error.message}</p>
      </div>
    );
  }

  return <EmailsClient initialEmails={(data ?? []) as EmailInquiry[]} />;
}