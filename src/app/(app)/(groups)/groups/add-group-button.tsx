"use client"

import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { Button } from "@/components/ui/button"
import { DialogContent } from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { CreateGroupForm } from "./create-group-form"
import { useRouter } from "next/navigation"

export function AddGroupButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  function onDone() {
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <DrawerDialog open={open} onOpenChange={setOpen} className="min-w-[50vw]">
        <CreateGroupForm />
      </DrawerDialog>
      <Button
        variant="ghost"
        className="gap-1 max-sm:size-fit max-sm:p-2"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="size-6" />
        <div className="max-sm:hidden">Добавить</div>
      </Button>
    </>
  )
}
