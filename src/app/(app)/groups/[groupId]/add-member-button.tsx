"use client";

import AddMember from "@/components/dialogs/add-member";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddMemberButton({
  group,
  isMember,
}: {
  group: any;
  isMember: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!isMember && (
        <Button
          size="icon"
          variant="ghost"
          className="ml-auto size-fit p-1"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
        </Button>
      )}
      <AddMember open={open} setOpen={setOpen} group={group} />
    </>
  );
}
