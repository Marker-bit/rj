"use client"

import { DrawerDialog } from "@/components/drawer"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { GroupMemberRole } from "@prisma/client"
import { BadgeCheck, Check, UserSquare2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function MemberInfo({
  member,
  group,
  i,
  savedBook,
  groupBook,
  pages,
}: {
  member: {
    userId: string
    user: {
      avatarUrl: string | null
      firstName: string | null
      lastName: string | null
      username: string
      verified: boolean
    }
    id: string
    role: GroupMemberRole
  }
  group: { id: string }
  i: number
  savedBook?: { id: string; description: string; pages: number }
  groupBook: { description: string; pages: number }
  pages: number | null
}) {
  return (
    <div className="flex items-center gap-2 rounded-md p-2 transition-all">
      <div className="relative">
        <Image
          src={member.user.avatarUrl || "/no-avatar.png"}
          alt="user"
          width={500}
          height={500}
          className="h-8 w-auto rounded-md"
        />
        <div className="absolute bottom-0 right-0 flex size-4 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border bg-white text-xs dark:bg-black">
          {i + 1}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 font-bold">
          {member.user.firstName} {member.user.lastName}
          {member.user.verified && (
            <BadgeCheck className="size-4 text-yellow-500" />
          )}
        </div>
        <div className="text-sm text-muted-foreground/70">
          @{member.user.username}
        </div>
        {savedBook && (
          <>
            {savedBook?.description === groupBook.description ? null : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-fit">
                    Описание
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[400px] p-4">
                  {member.role !== GroupMemberRole.MEMBER ? (
                    savedBook.description
                  ) : (
                    <p className="text-muted-foreground">
                      Вы не можете просмотреть чужое описание
                    </p>
                  )}
                </PopoverContent>
              </Popover>
            )}
            {savedBook.pages === groupBook.pages ? null : (
              <div className="text-sm text-muted-foreground/70">
                {savedBook.pages} стр. вместо {groupBook.pages}
              </div>
            )}
          </>
        )}
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {pages === null || pages === undefined ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <X className="size-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>Человек не добавил себе эту книгу</TooltipContent>
          </Tooltip>
        ) : pages === groupBook.pages ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Check className="size-4 text-green-500" />
            </TooltipTrigger>
            <TooltipContent>Книга полностью прочитана</TooltipContent>
          </Tooltip>
        ) : (
          pages < groupBook.pages && pages
        )}
        <Link
          key={member.userId}
          href={`/groups/${group.id}/members/${member.id}`}
        >
          <Button variant="ghost" size="icon" className="size-fit p-1">
            <UserSquare2 className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
