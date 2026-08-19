// ============================================================
// JOB TYPES & HELPERS
// ============================================================
// Openings now live in Supabase (`job_openings` table), managed
// from the admin Careers panel. This file only keeps the shared
// TypeScript types and small pure helpers used across the app
// (public Careers page, chat route, admin panel).
// ============================================================

export type Department = "Engineering" | "Security" | "Design" | "Operations";

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface Job {
  id: string;
  title: string;
  dept: Department;
  type: JobType;
  location: string;
  positions: number;
  filled: number;
  description?: string;
  requirements?: string[];
  postedAt?: string; // ISO date, e.g. "2026-07-15"
}

export function remainingSpots(job: Job): number {
  return Math.max(job.positions - job.filled, 0);
}

export function isOpen(job: Job): boolean {
  return remainingSpots(job) > 0;
}