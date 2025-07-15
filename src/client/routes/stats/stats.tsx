import { Stats } from "@/models/stats.model";
import { useQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import StatsImage from "../../../public/stats.png";

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
    <div className="grid w-full h-screen">
      <div className="aspect-[204/275] max-h-screen col-start-1 row-start-1 mx-auto bg-red-500/25 z-10"></div>
      <img
        src={StatsImage}
        alt=""
        className="object-contain w-full h-full max-h-screen col-start-1 row-start-1"
      />
    </div>
  );
}
