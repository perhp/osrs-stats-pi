import { Stats } from "@/models/stats.model";
import { useQuery } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";

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
      <div className="flex flex-col h-screen bg-slate-800">
        <div className="grid items-center text-2xl font-bold text-gray-100 place-content-center grow">
          <LoaderPinwheel className="animate-spin size-14" />
        </div>
      </div>
    );
  }

  if (statsIsError || !stats) {
    return <div>Error</div>;
  }

  console.log(stats);

  return (
    <div>
      <img src="./public/stats.png" />
    </div>
  );
}
