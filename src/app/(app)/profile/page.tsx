import { ChevronLeft, Edit, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Stats } from "@/components/stats";
import { validateRequest } from "@/lib/server-validate-request";
import { db } from "@/lib/db";
import { CopyUrl } from "./CopyUrl";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProfilePage() {
  const { user } = await validateRequest();
  if (!user) return null;

  const userData = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });

  return (
    <div className="mb-[15vh]">
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/home">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Профиль
        </div>
        <Link href="/friends" className="ml-auto">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <div className="font-semibold">
              <Users2 className="w-6 h-6" />
            </div>
          </button>
        </Link>
        <Link href="/profile/settings">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <div className="font-semibold">
              <Edit className="w-6 h-6" />
            </div>
          </button>
        </Link>
      </div>
      <div className="m-3 p-4 rounded-md border border-zinc-200 flex gap-2 items-center">
        <Image
          src={userData?.avatarUrl ? userData?.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="rounded-full w-20 h-20"
        />
        <div className="flex flex-col">
          <div className="text-3xl font-semibold">
            {userData?.firstName} {userData?.lastName}
          </div>
          <div className="text-sm text-black/70">@{userData?.username}</div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <CopyUrl username={userData?.username!} />
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
          </div>
        }
      >
        <Stats />
      </Suspense>
    </div>
  );
}
