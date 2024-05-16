"use client"

import AddGroupLink from "@/components/dialogs/add-group-link";
import AddMember from "@/components/dialogs/add-member"
import { Button } from "@/components/ui/button"
import { Link2 } from "lucide-react"
import { useState } from "react"

export function LinkMemberButton({
  group,
  isMember,
}: {
  group: any
  isMember: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {!isMember && (
        <Button
          size="icon"
          variant="ghost"
          className="size-fit p-1"
          onClick={() => setOpen(true)}
        >
          <Link2 className="size-4" />
        </Button>
      )}
      <AddGroupLink open={open} setOpen={setOpen} group={group} />
    </>
  )
}
