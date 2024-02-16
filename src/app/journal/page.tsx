import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">Журнал</div>
      </div>
      <div className="p-3">
        Журнал!
      </div>
    </div>
  )
}