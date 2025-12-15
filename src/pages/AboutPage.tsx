"use client";

import { About } from "../../components/About";
import type { TeamMember } from "../types";

interface AboutPageProps {
  cafeName: string;
  teamMembers: TeamMember[];
}

export function AboutPage({ cafeName, teamMembers }: AboutPageProps) {
  return <About cafeName={cafeName} teamMembers={teamMembers} />;
}
