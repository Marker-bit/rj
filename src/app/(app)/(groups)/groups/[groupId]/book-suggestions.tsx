"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DrawerDialog } from "@/components/ui/drawer-dialog"
import {
  GroupBookSuggestion,
  GroupMember,
  GroupMemberRole,
} from "@prisma/client"
import { BookUser } from "lucide-react"
import { useState } from "react"
import { Suggestion } from "./suggestion"
import { SuggestBook } from "./suggest-book";

export function BookSuggestions({
  suggestions,
  member,
}: {
  suggestions: GroupBookSuggestion[]
  member: GroupMember
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="size-fit p-1"
        onClick={() => setOpen(true)}
      >
        <BookUser className="size-4" />
      </Button>
      <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2">
            Предложения книг
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 p-4">
          <SuggestBook groupId={member.groupId} />
          {suggestions
            .filter((s) =>
              member.role === GroupMemberRole.MEMBER
                ? s.memberId === member.id
                : true
            )
            .map((suggestion) => (
              <Suggestion
                key={suggestion.id}
                suggestion={suggestion}
                role={member.role}
              />
            ))}
        </div>
      </DrawerDialog>
    </>
  )
}
