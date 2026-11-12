"use client";

import type {
  GroupBookSuggestion,
  GroupMember,
} from "@/generated/prisma/browser";
import { GroupMemberRole } from "@/generated/prisma/enums";
import { BookUser } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Suggestion } from "./suggestion";

const SuggestBook = dynamic(
  () => import("./suggest-book").then((mod) => mod.SuggestBook),
  {
    ssr: false,
  },
);

export function BookSuggestions({
  suggestions,
  member,
}: {
  suggestions: GroupBookSuggestion[];
  member: GroupMember;
}) {
  const [open, setOpen] = useState(false);
  const [suggestMounted, setSuggestMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setSuggestMounted(true);
    }
  }, [open]);

  return (
    <>
      <Button
        aria-label="Предложения книг"
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
          {suggestMounted && <SuggestBook groupId={member.groupId} />}
          {suggestions
            .filter((s) =>
              member.role === GroupMemberRole.MEMBER
                ? s.memberId === member.id
                : true,
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
  );
}
