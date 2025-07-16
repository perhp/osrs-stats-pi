import { SKILL_NAMES } from "@/server/routes/api/get-stats";

export type SkillName = (typeof SKILL_NAMES)[number];

export type Stats = Record<
  SkillName,
  { rank: number; level: number; experience: number }
>;
