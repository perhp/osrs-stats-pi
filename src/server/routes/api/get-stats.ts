import { RouteMap } from "@/models/route.model";
import { Stats } from "@/models/stats.model";

export const SKILL_NAMES = [
  "overall",
  "attack",
  "defence",
  "strength",
  "hitpoints",
  "ranged",
  "prayer",
  "magic",
  "cooking",
  "woodcutting",
  "fletching",
  "fishing",
  "firemaking",
  "crafting",
  "smithing",
  "mining",
  "herblore",
  "agility",
  "thieving",
  "slayer",
  "farming",
  "runecraft",
  "hunter",
  "construction",
] as const;

function parseSkills(raw: string) {
  const rows = raw
    .trim()
    .split("\n")
    .map((l) => l.split(",").map(Number));

  return Object.fromEntries(
    SKILL_NAMES.map((name, i) => {
      const [rank, level, experience] = rows[i] ?? [-1, 1, 0];
      return [name, { rank, level, experience }];
    }),
  ) as Stats;
}

export default {
  "/api/stats": {
    async GET() {
      const url = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(
        process.env.CHARACTER_NAME!,
      )}`;

      const text = await fetch(url).then((r) => r.text());

      return new Response(JSON.stringify(parseSkills(text)), {
        headers: { "content-type": "application/json" },
      });
    },
  },
} satisfies RouteMap;
