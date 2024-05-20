import { ChevronLeft, UserX } from "lucide-react"
import Link from "next/link"
import { FriendView } from "@/components/users/friend-view"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"

export const dynamic = "force-dynamic"

export default async function FriendsPage() {
  const { user } = await validateRequest()
  if (!user) {
    return new Response(null, {
      status: 401,
    })
  }
  const friends = await db.user.findMany({
    where: {
      follower: {
        some: {
          secondId: user.id,
        },
      },
    },
    include: {
      following: true,
    },
  })

  return (
    <div>
      <div className="m-2 flex items-center gap-2 text-5xl font-black">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="size-8" />
          </Button>
        </Link>
        Подписчики
        <Button variant="ghost" asChild>
          <Link href="/friends" className="ml-auto">
            Подписки
          </Link>
        </Button>
      </div>
      <div className="p-3">
        <div className="flex flex-col gap-2">
          {friends.length === 0 && (
            <div className="flex items-center gap-2 rounded-xl border p-2 text-xl">
              <UserX className="size-10" />
              <div className="flex flex-col">
                <div>У вас нет подписчиков</div>
                <div className="text-xs text-black/50">Зовите друзей!</div>
              </div>
            </div>
          )}

          {friends.map((friend) => (
            <FriendView
              key={friend.id}
              friend={friend}
              following={friend.following.some((f) => f.firstId === user.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
