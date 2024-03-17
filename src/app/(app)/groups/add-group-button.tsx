"use client";

import { DrawerDialog } from "@/components/drawer";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { CreateGroupForm } from "./create-group-form";
import { useRouter } from "next/navigation";

export function AddGroupButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function onDone() {
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
        <CreateGroupForm onDone={onDone} />
      </DrawerDialog>
      <Button
        variant="ghost"
        className="max-sm:w-fit max-sm:h-fit max-sm:p-2 gap-1"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="w-6 h-6" />
        <div className="max-sm:hidden">Добавить</div>
      </Button>
    </>
  );
}
