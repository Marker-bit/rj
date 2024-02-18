"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader, UserX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FriendView } from "../FriendView";

export default function FollowersPage() {
  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: () => fetch("/api/profile/followers").then((res) => res.json()),
  });
  if (friendsQuery.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }
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
          Подписчики
        </div>
      </div>
      <div className="p-3">
        <div className="flex flex-col gap-2">
          {/* <div className="p-2 flex gap-2 items-center rounded-xl border border-zinc-200 text-xl">
            <UserX className="w-10 h-10" />
            <div className="flex flex-col">
              <div>Скоро добавим функцию друзей</div>
              <div className="text-xs text-black/50">Примерно завтра</div>
            </div>
          </div> */}
          {friendsQuery.data.map(
            ({
              second: friend,
            }: {
              second: {
                firstName: string;
                lastName: string;
                username: string;
                id: string;
                following: boolean;
              };
            }) => (
              // <Link href={`/friends/${"a"}`} key={friend.id}>
              //   <div className="p-4 rounded-md border border-zinc-200 flex gap-2 items-center cursor-pointer group hover:bg-zinc-100 transition-colors">
              //     <Image
              //       src="/no-avatar.png"
              //       alt="avatar"
              //       width={100}
              //       height={100}
              //       className="rounded-full w-16 h-16"
              //     />
              //     <div className="flex flex-col">
              //       <div className="text-xl font-semibold">{friend.firstName} {friend.lastName}</div>
              //       <div className="text-sm text-black/70">@{friend.username}</div>
              //       <div className="bg-blue-500 p-2 rounded-md shadow-md shadow-blue-300 cursor-pointer flex items-center justify-center text-white text-sm mt-2">
              //         <UserX className="w-4 h-4 mr-2" />
              //         Удалить из друзей
              //       </div>
              //     </div>
              //     <button className="ml-auto">
              //       <ChevronRight className="w-7 h-7 text-black/50 group-hover:text-black transition-colors" />
              //     </button>
              //   </div>
              // </Link>
              <FriendView key={friend.id} friend={friend} />
            )
          )}
          {/* <Link href={`/friends/${"a"}`}>
            <div className="p-4 rounded-md border border-zinc-200 flex gap-2 items-center cursor-pointer group hover:bg-zinc-100 transition-colors">
              <Image
                src="/avatar.jpg"
                alt="avatar"
                width={100}
                height={100}
                className="rounded-full w-16 h-16"
              />
              <div className="flex flex-col">
                <div className="text-xl font-semibold">Mark Pentus</div>
                <div className="text-sm text-black/70">@mark.pentus</div>
                <div className="bg-blue-500 p-2 rounded-md shadow-md shadow-blue-300 cursor-pointer flex items-center justify-center text-white text-sm mt-2">
                  <UserX className="w-4 h-4 mr-2" />
                  Удалить из друзей
                </div>
              </div>
              <button className="ml-auto">
                <ChevronRight className="w-7 h-7 text-black/50 group-hover:text-black transition-colors" />
              </button>
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
