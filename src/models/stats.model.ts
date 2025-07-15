import { SKILL_NAMES } from "@/server/routes/api/get-stats";

export type Stats = Record<
  (typeof SKILL_NAMES)[number],
  { rank: number; level: number; experience: number }
>;
