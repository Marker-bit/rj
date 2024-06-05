"use client"

import { DeleteGroupBookModal } from "@/components/dialogs/groups/delete-group-book-modal"
import { EditGroupBookModal } from "@/components/dialogs/groups/edit-group-book-modal"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Group, GroupBook } from "@prisma/client"
import {
  BarChartHorizontalBig,
  Edit,
  LinkIcon,
  MoreHorizontal,
  Trash,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import BindBookModal from "./bind-book-modal"

export function MoreActions({
  book,
  addedBook,
}: {
  book: GroupBook & { group: Group }
  addedBook: boolean
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [bindOpen, setBindOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="size-fit p-1">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!addedBook && (
            <DropdownMenuItem onClick={() => setBindOpen(true)}>
              <LinkIcon className="mr-2 size-4" />
              Связать
            </DropdownMenuItem>
          )}

          <Link href={`/groups/${book.group.id}/stats/${book.id}`}>
            <DropdownMenuItem>
              <BarChartHorizontalBig className="mr-2 size-4" />
              Статистика
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 size-4" />
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <Trash className="mr-2 size-4" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteGroupBookModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        book={book}
      />
      <EditGroupBookModal open={editOpen} setOpen={setEditOpen} book={book} />
      <BindBookModal open={bindOpen} setOpen={setBindOpen} groupBook={book} />
    </>
  )
}
