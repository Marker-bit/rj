"use client";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { CreateGroupForm } from "./create-group-form";

export function AddGroupButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DrawerDialog open={open} onOpenChange={setOpen} className="sm:w-[425px]">
        <DialogTitle className="hidden">Создать группу</DialogTitle>
        <CreateGroupForm />
      </DrawerDialog>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        Создать
      </Button>
    </>
  );
}
