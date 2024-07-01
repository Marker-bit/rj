"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Book } from "@prisma/client"
import { MoreVertical, Trash, UserCircle } from "lucide-react"
import Link from "next/link"

export default function BookMenu({ book }: { book: Book }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/admin/profile/${book.userId}`}>
          <DropdownMenuItem>
            <UserCircle className="mr-2 size-4" /> Посмотреть профиль
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <Trash className="mr-2 size-4" /> Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
