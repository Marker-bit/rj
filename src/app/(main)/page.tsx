import { Books } from "@/components/main/books";
import { Profile } from "@/components/main/profile";
import { Stats } from "@/components/main/stats";

export default function Home() {
  return (
    <div>
      <div className="flex p-1 min-h-10 items-center bg-zinc-100 border-b border-zinc-200 relative">
        <div className="font-semibold mx-auto">Главная</div>
      </div>
      <div className="flex flex-col">
        <Books />
        <Stats />
        <Profile />
      </div>
    </div>
  );
}
