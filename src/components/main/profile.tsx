"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Profile() {
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/profile").then((res) => res.json()),
  });
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-300 p-3 cursor-default">
      <Link href="/profile">
        <h2 className="text-5xl font-black uppercase flex gap-1 items-center cursor-pointer hover:text-black/70 active:scale-90 transition-transform w-fit flex-wrap">
          Профиль
          <ChevronRight className="w-12 h-12" strokeWidth={3} />
        </h2>
      </Link>
      {userQuery.isPending ? (
        <div className="p-2 rounded-md border border-zinc-200 flex gap-2 items-center justify-center py-5">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="p-2 rounded-md border border-zinc-200 flex gap-2 items-center">
          <Image
            src={
              userQuery.data?.avatarUrl
                ? userQuery.data?.avatarUrl
                : "/no-avatar.png"
            }
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full w-20 h-20"
          />
          <div className="flex flex-col">
            <div className="text-3xl font-semibold">
              {userQuery.data?.firstName} {userQuery.data?.lastName}
            </div>
            <div className="text-sm text-black/70">
              @{userQuery.data?.username}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
