// ============================================================
// JOBS DATA — single source of truth
// ============================================================
// Add, remove, or edit jobs here. The careers page (and the
// future employer management page) both read from this file,
// so any change here reflects everywhere automatically.
//
// To add a job: copy an object below, give it a unique `id`,
// and fill in the fields.
//
// To remove a job: delete its object from the array (or set
// `positions` equal to `filled` to show it as fully staffed
// without deleting the listing).
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

export const jobs: Job[] = [
  {
    id: "fe-engineer-01",
    title: "Frontend Engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote",
    positions: 2,
    filled: 0,
    description:
      "Build and ship polished, animated UI across our client-facing products using React, Next.js, and Framer Motion.",
    requirements: [
      "2+ years with React/Next.js",
      "Strong CSS and animation fundamentals",
      "Comfortable working async, remote-first",
    ],
    postedAt: "2026-07-15",
  },
  {
    id: "security-eng-01",
    title: "Security Engineer",
    dept: "Security",
    type: "Full-time",
    location: "Remote",
    positions: 1,
    filled: 0,
    description:
      "Own security reviews, threat modeling, and hardening across client projects spanning healthcare, SaaS, and CRM platforms.",
    requirements: [
      "Experience with pentesting or red-team work",
      "Familiarity with OWASP Top 10",
      "Clear written communication for client-facing reports",
    ],
    postedAt: "2026-07-15",
  },
  {
    id: "product-designer-01",
    title: "Product Designer",
    dept: "Design",
    type: "Contract",
    location: "Remote",
    positions: 1,
    filled: 0,
    description:
      "Design end-to-end product experiences for client engagements, from wireframes to high-fidelity, motion-ready UI.",
    requirements: [
      "Strong portfolio in product/UX design",
      "Figma fluency",
      "Bonus: motion/prototyping experience",
    ],
    postedAt: "2026-07-20",
  },
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

// Only jobs with open spots remaining
export const openJobs = jobs.filter((job) => job.filled < job.positions);

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id);
}

export function remainingSpots(job: Job): number {
  return Math.max(job.positions - job.filled, 0);
}