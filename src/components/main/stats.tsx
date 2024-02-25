import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Stats as StatsData } from "@/components/stats";

export function Stats() {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
      <Link href="/profile#stats">
        <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit flex-wrap">
          Статистика
          <ChevronRight className="w-12 h-12" strokeWidth={3} />
        </h2>
      </Link>
      <StatsData />
    </div>
  );
}
