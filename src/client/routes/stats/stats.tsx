import { SkillName, Stats } from "@/models/stats.model";
import { useQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import StatsImage from "../../../public/stats.png";

const skillNames: SkillName[] = [
  "attack",
  "hitpoints",
  "mining",
  "strength",
  "agility",
  "smithing",
  "defence",
  "herblore",
  "fishing",
  "ranged",
  "thieving",
  "cooking",
  "prayer",
  "crafting",
  "firemaking",
  "magic",
  "fletching",
  "woodcutting",
  "runecraft",
  "slayer",
  "farming",
  "construction",
  "hunter",
];

function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async (): Promise<Stats> => {
      const response = await fetch("/api/stats");
      return await response.json();
    },
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
}

export default function Stats() {
  const {
    data: stats,
    isLoading: statsIsLoading,
    isError: statsIsError,
  } = useStats();

  if (statsIsLoading) {
    return (
      <div className="flex flex-col h-screen bg-black">
        <div className="grid items-center text-2xl font-bold text-gray-100 place-content-center grow">
          <LoaderPinwheel className="animate-spin size-14" />
        </div>
      </div>
    );
  }

  if (statsIsError || !stats) {
    return <div>Error</div>;
  }

  return (
    <div className="grid w-full h-screen text-white">
      <div className="relative grid grid-cols-3 aspect-[204/275] max-h-screen max-w-screen col-start-1 row-start-1 my-auto z-10 p-5 pb-7">
        {skillNames.map((skillName) => (
          <div key={skillName} className="relative">
            <span
              style={{ textShadow: "2px 2px 0 black" }}
              className="absolute text-[30px] text-yellow-300 right-11 top-7 leading-0"
            >
              {stats[skillName].level ?? 1}
            </span>
            <span
              style={{ textShadow: "2px 2px 0 black" }}
              className="absolute text-[30px] text-yellow-300 right-3 bottom-4.5 leading-0"
            >
              {stats[skillName].level ?? 1}
            </span>
          </div>
        ))}
        <span
          style={{ textShadow: "2px 2px 0 black" }}
          className="absolute text-[30px] text-yellow-300 leading-0 bottom-11 right-16"
        >
          {stats["overall"].level ?? 1}
        </span>
      </div>
      <img
        src={StatsImage}
        className="object-contain w-full h-full max-h-screen col-start-1 row-start-1 max-w-screen"
      />
    </div>
  );
}
