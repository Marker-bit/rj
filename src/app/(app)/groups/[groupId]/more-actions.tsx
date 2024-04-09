"use client";

import { DeleteGroupBookModal } from "@/components/dialogs/delete-group-book-modal";
import { DrawerDialog } from "@/components/drawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Group, GroupBook } from "@prisma/client";
import {
  BarChartHorizontalBig,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MoreActions({ book }: { book: GroupBook & { group: Group } }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="p-1 h-fit w-fit">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={`/groups/${book.group.id}/stats/${book.id}`}>
            <DropdownMenuItem>
              <BarChartHorizontalBig className="w-4 h-4 mr-2" />
              Статистика
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <Edit className="w-4 h-4 mr-2" />
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteGroupBookModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        book={book}
      />
    </>
  );
}
