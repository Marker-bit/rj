"use client";

import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

export default function BooksPage() {
  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b min-h-10">
        <Link href="/home">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Поиск
        </div>
      </div>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
        }}
      >
        <div className="flex gap-2 m-2 p-2 border rounded-xl">
          <Input className="w-full" />
          <button
            className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border mx-auto"
            type="submit"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
