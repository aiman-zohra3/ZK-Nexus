// app/projects/[slug]/page.tsx

import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projects";
import ProjectDetail from "@/components/ProjectDetails";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

// pre-builds a static page for every project in data/projects.ts —
// add a project there and a route appears here automatically.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.name} — ZK Nexus`,
    description: project.landingLine,
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}