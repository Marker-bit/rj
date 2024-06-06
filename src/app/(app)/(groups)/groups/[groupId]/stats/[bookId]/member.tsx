"use client"

import { Button } from "@/components/ui/button"
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
import {
  Book,
  GroupBook,
  GroupMember,
  GroupMemberRole,
  User,
} from "@prisma/client"
import { BadgeCheck, Check, UserSquare2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ChangedInfo from "../../_components/changed-info"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MemberInfo({
  member,
  group,
  i,
  savedBook,
  groupBook,
  pages,
  currentMember,
}: {
  member: GroupMember & {
    user: User
  }
  currentMember: GroupMember
  group: { id: string }
  i: number
  savedBook?: Book
  groupBook: GroupBook
  pages: number | null
}) {
  return (
    <div className="flex items-center gap-2 rounded-md p-2 transition-all">
      <div className="relative">
        <Avatar>
          <AvatarImage src={member.user?.avatarUrl} />
          <AvatarFallback>
            {member.user?.firstName && member.user?.firstName[0]}
            {member.user?.lastName && member.user?.lastName[0]}
          </AvatarFallback>
        </Avatar>
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
          <ChangedInfo
            book={savedBook}
            member={member}
            groupBook={groupBook}
            currentMember={currentMember}
          />
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
