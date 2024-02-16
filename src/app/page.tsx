import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex p-1 min-h-10 items-center bg-zinc-100 border-b border-zinc-200 relative">
        <div className="font-semibold mx-auto">Главная</div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
          <Link href="/books">
            <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit">
              Книги
              <ChevronRight className="w-12 h-12" strokeWidth={3} />
            </h2>
          </Link>
          <div>???</div>
        </div>
        <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
          <Link href="/profile">
            <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit">
              Профиль
              <ChevronRight className="w-12 h-12" strokeWidth={3} />
            </h2>
          </Link>
          <div className="p-2 rounded-md border border-zinc-200 flex gap-2 items-center">
            <Image
              src="/avatar.jpg"
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full w-20 h-20"
            />
            <div className="flex flex-col">
              <div className="text-3xl font-semibold">Mark Pentus</div>
              <div className="text-sm text-black/70">@mark.pentus</div>
              {/* <div className="bg-blue-500 p-2 rounded-md shadow-md shadow-blue-300 cursor-pointer flex items-center justify-center text-white text-sm mt-2">
            <UserPlus className="w-4 h-4 mr-2" />
            Добавить в друзья
          </div> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
          <Link href="/profile#stats">
            <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit">
              Статистика
              <ChevronRight className="w-12 h-12" strokeWidth={3} />
            </h2>
          </Link>
          <div>???</div>
        </div>
      </div>
    </div>
  );
}
