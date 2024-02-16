"use client";

import {
  Book,
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AutoResizeInput from "../AutoResize";

export default function BooksPage() {
  const [choosingPages, setChoosingPages] = useState(false);
  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Книги
        </div>
      </div>
      <div className="p-3 flex flex-col">
        <div className="border border-zinc-200 p-2 rounded-md hover:shadow transition-shadow flex gap-2">
          <Image
            src="/book.png"
            alt="book"
            width={100}
            height={100}
            className="rounded-md h-40 w-auto"
          />
          <div className="flex flex-col">
            <div className="font-bold text-xl">Название</div>
            <div className="text-sm">Автор</div>
            <div className="flex gap-2 flex-wrap my-2">
              <div className="bg-blue-100 flex gap-2 items-center text-blue-500 px-3 rounded-xl cursor-default">
                <Book className="w-4 h-4" /> Читается
              </div>
              <div className="bg-green-100 flex gap-2 items-center text-green-500 px-3 rounded-xl cursor-default">
                <BookOpen className="w-4 h-4" /> 10 страниц
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="flex gap-2 items-center w-fit bg-blue-500 rounded-xl text-white py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40">
                <BookOpenCheck className="w-4 h-4" />
                Прочитана
              </button>
              <button
                className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200"
                onClick={() => {
                  setChoosingPages(true);
                }}
              >
                <BookOpen className="w-4 h-4" />
                {/* <img src="https://em-content.zobj.net/source/telegram/386/open-book_1f4d6.webp" className="w-6 h-6" /> */}
                {choosingPages ? (
                  <AutoResizeInput
                    autoFocus
                    className="outline-none border-b border-black w-6 bg-transparent"
                    onBlur={() => setChoosingPages(false)}
                    onKeyUp={(evt: any) => {
                      if (evt.key === "Enter") {
                        console.log(parseInt(evt.target.value));
                        setChoosingPages(false);
                      }
                    }}
                  />
                ) : (
                  <div>Отметить страницы</div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
