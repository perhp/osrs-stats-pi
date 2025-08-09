import { SkillName, Stats as StatsModel } from "@/models/stats.model";
import { getLevelInfo } from "@/utils/experience-table";
import { useQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import StatsImage from "../../../public/stats.png";

const SKILL_NAMES = [
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
] as const satisfies Readonly<SkillName[]>;

interface TimeWindowOpts {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
  tz?: string;
  checkMs?: number;
}

function useDailyTimeWindow({
  start,
  end,
  tz = "Europe/Copenhagen",
  checkMs = 30_000,
}: TimeWindowOpts): boolean {
  const parseHM = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return { h, m };
  };

  const startHM = useMemo(() => parseHM(start), [start]);
  const endHM = useMemo(() => parseHM(end), [end]);
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    [tz],
  );

  const compute = useCallback(() => {
    const now = new Date();
    const parts = formatter.formatToParts(now);
    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
    const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

    const minsNow = hour * 60 + minute;
    const minsStart = startHM.h * 60 + startHM.m;
    const minsEnd = endHM.h * 60 + endHM.m;

    if (minsStart <= minsEnd) {
      return minsNow >= minsStart && minsNow < minsEnd;
    }
    return minsNow >= minsStart || minsNow < minsEnd;
  }, [endHM.h, endHM.m, formatter, startHM.h, startHM.m]);

  const [active, setActive] = useState<boolean>(() => compute());

  useEffect(() => {
    setActive(compute());
  }, [compute]);

  useEffect(() => {
    const id = setInterval(() => setActive(compute()), checkMs);
    return () => clearInterval(id);
  }, [checkMs, compute]);

  return active;
}

function useStats(enabled: boolean) {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async (): Promise<StatsModel> => {
      const res = await fetch("/api/stats");
      if (!res.ok) {
        throw new Error(`Failed to fetch stats: ${res.status}`);
      }
      return res.json();
    },
    enabled,
    refetchInterval: enabled ? 60_000 : false,
    refetchIntervalInBackground: enabled,
    staleTime: enabled ? 0 : Infinity,
    refetchOnWindowFocus: enabled,
    refetchOnReconnect: enabled,
  });
}

type SkillTileProps = {
  level: number;
  experience: number;
};

const numberShadow = { textShadow: "2px 2px 0 black" } as const;

const SkillTile = memo(function SkillTile({
  level,
  experience,
}: SkillTileProps) {
  const progress = level < 99 ? getLevelInfo(experience).progress : 0;

  return (
    <div className="relative">
      <span
        style={numberShadow}
        className="absolute text-[30px] right-11 top-7 leading-0"
        aria-label="level"
      >
        {level || 1}
      </span>
      <span
        style={numberShadow}
        className="absolute text-[30px] right-3 bottom-5 leading-0"
        aria-label="level duplicate"
      >
        {level || 1}
      </span>
      <div
        className="absolute inset-x-2.5 -bottom-0.5 flex h-1"
        aria-label="progress"
      >
        <div
          className="h-full bg-green-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});

export default function StatsPanel() {
  const isActive = useDailyTimeWindow({ start: "07:00", end: "23:00" });

  const { data: stats, isLoading, isError, error } = useStats(isActive);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-black">
        <div className="grid items-center text-2xl font-bold text-gray-100 grow place-content-center">
          <LoaderPinwheel className="size-14 animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error instanceof Error ? error.message : "Error"}</p>
      </div>
    );
  }

  return (
    <div className="grid h-[800px] w-[475px] text-[rgb(253_253_0)]">
      <div className="relative grid grid-cols-3 aspect-[204/275] max-h-screen max-w-screen col-start-1 row-start-1 my-auto z-10 p-5 pb-[26px]">
        {SKILL_NAMES.map((name) => {
          const { level = 1, experience = 0 } = stats[name] ?? {};
          return <SkillTile key={name} level={level} experience={experience} />;
        })}
        <span
          style={numberShadow}
          className="absolute bottom-[31px] right-16 text-[30px] leading-none"
          aria-label="overall level"
        >
          {stats.overall.level ?? 1}
        </span>
      </div>
      <img
        src={StatsImage}
        alt="OSRS skill panel"
        className="object-contain w-full h-full max-h-screen col-start-1 row-start-1 max-w-screen"
      />
    </div>
  );
}
