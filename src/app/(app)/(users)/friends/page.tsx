import { ChevronLeft, UserX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FriendView } from "@/components/users/friend-view";
import { db } from "@/lib/db";
import { pageMetadata } from "@/lib/page-metadata";
import { validateRequest } from "@/lib/server-validate-request";
import { publicUserSelect } from "@/lib/user-select";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata("Подписки");

export default async function FriendsPage() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/auth/login");
  }
  const friends = await db.user.findMany({
    where: {
      following: {
        some: {
          firstId: user.id,
        },
      },
    },
    select: publicUserSelect,
  });
  return (
    <div>
      <div className="m-2 flex items-center gap-2 text-3xl font-bold">
        <SimpleTooltip text="Назад">
          <Link href="/home" aria-label="Назад">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="size-8" />
            </Button>
          </Link>
        </SimpleTooltip>
        Подписки
        <Button variant="ghost" asChild>
          <Link href="/followers" className="ml-auto">
            Подписчики
          </Link>
        </Button>
      </div>
      <div className="p-3">
        <div className="flex flex-col gap-2">
          {friends.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UserX />
                </EmptyMedia>
                <EmptyTitle>У вас нет подписок</EmptyTitle>
                <EmptyDescription>
                  Подписки появятся, когда вы откроете профиль читателя.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild variant="outline">
                  <Link href="/groups">К группам</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}

          {friends.map((friend) => (
            <FriendView key={friend.id} friend={friend} following={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
