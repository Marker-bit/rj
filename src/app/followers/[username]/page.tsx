"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserPage() {
  const { username } = useParams();

  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 relative min-h-10">
        <Link href="/friends">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Друзья</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">Друг</div>
      </div>
      <div className="p-3">
        <div className="p-4 rounded-md border border-zinc-200 flex gap-2 items-center cursor-pointer">
          <Image
            src="/avatar.jpg"
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full w-16 h-16"
          />
          <div className="flex flex-col">
            <div className="text-xl font-semibold">Mark Pentus</div>
            <div className="text-sm text-black/70">@{username}</div>
            {/* <div className="bg-blue-500 p-2 rounded-md shadow-md shadow-blue-300 cursor-pointer flex items-center justify-center text-white text-sm mt-2">
            <UserX className="w-4 h-4 mr-2" />
            Удалить из друзей
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
