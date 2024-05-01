"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { User } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BadgeCheck, UserPlus, UserX } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader } from "./ui/loader"

export function FriendView({
  friend,
  following,
}: {
  friend: User
  following?: boolean
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const userQuery = useQuery({
    queryKey: ["user", friend.username],
    queryFn: async () => {
      const res = await fetch(`/api/profile/${friend.username}`)
      return await res.json()
    },
  })
  const followMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/profile/${friend.username}/follow`, {
        method: following || userQuery.data?.following ? "DELETE" : "POST",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", friend.username],
      })
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      })
      queryClient.invalidateQueries({
        queryKey: ["followers"],
      })
      router.refresh()
    },
  })

  const followingRes = following || userQuery.data?.following
  return (
    <Link href={`/profile/${friend.username}`}>
      <div className="group flex cursor-pointer items-center gap-2 rounded-md border p-4 transition-colors">
        <Image
          src={friend.avatarUrl ? friend.avatarUrl : "/no-avatar.png"}
          alt="avatar"
          width={100}
          height={100}
          className="size-16 rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xl font-semibold">
            {friend.firstName} {friend.lastName}
            {friend.verified && (
              <BadgeCheck className="size-6 text-yellow-500" />
            )}
          </div>
          <div className="text-sm text-muted-foreground/70">
            @{friend.username}
          </div>
          {followingRes === undefined && userQuery.isPending ? (
            <Skeleton className="h-10 w-48 rounded-md" />
          ) : (
            <Button
              className="mt-2 w-fit gap-2"
              onClick={(evt) => {
                followMutation.mutate()
                evt.preventDefault()
              }}
              disabled={followMutation.isPending}
              variant={followingRes === true ? "outline" : "default"}
            >
              {followingRes === false ? (
                <>
                  {followMutation.isPending ? (
                    <Loader invert={!followingRes} className="size-4" />
                  ) : (
                    <UserPlus className="size-4" />
                  )}
                  Подписаться
                </>
              ) : (
                <>
                  {followMutation.isPending ? (
                    <Loader invert={!followingRes} className="size-4" />
                  ) : (
                    <UserX className="size-4" />
                  )}
                  Отменить подписку
                </>
              )}
            </Button>
          )}
        </div>
        {/* <button className="ml-auto">
        <ChevronRight className="w-7 h-7 text-black/50 group-hover:text-black transition-colors" />
      </button> */}
      </div>
    </Link>
  )
}
