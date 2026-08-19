import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import CareersPageClient from "./CareersPageClient";
import type { Job } from "@/data/jobs";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
 const { data, error } = await supabaseAdmin
    .from("job_openings")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load job_openings:", error);
  }

  const jobs: Job[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    dept: row.dept,
    type: row.type,
    location: row.location,
    positions: row.positions,
    filled: row.filled,
    description: row.description ?? undefined,
    requirements: row.requirements ?? undefined,
    postedAt: row.posted_at ?? undefined,
  }));

  return <CareersPageClient jobs={jobs} />;
}