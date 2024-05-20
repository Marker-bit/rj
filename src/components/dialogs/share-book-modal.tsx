"use client"

import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import { CopyCheck, CopyIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { Book } from "@/lib/api-types"
import { Loader } from "../ui/loader"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function ShareBookModal({
  open,
  setOpen,
  book,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  book: Book
}) {
  const [copyLink, setCopyLink] = useState<string>()
  // const [link, setLink] = useState("");
  // useEffect(() => {
  //   setLink(`${window.location.origin}/books/${book.id}`);
  // }, [book.id]);
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const createLink = async () => {
    setLoading(true)
    const resp = await fetch(`/api/books/${book.id}/links`, {
      method: "POST",
    })
    const res = await resp.json()
    if (resp.ok) {
      setLoading(false)
      router.refresh()
    } else {
      toast.error("Возникла проблема при создании ссылки", {
        description: res.error,
      })
    }
  }
  return (
    <DrawerDialog
      open={open}
      onOpenChange={setOpen}
      className="md:w-[50vw] lg:w-[40vw]"
    >
      <DialogHeader>
        <DialogTitle>Поделиться</DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        <div className="flex flex-col gap-2">
          {book.links.map((link) => (
            <div className="flex w-full gap-2" key={link.id}>
              <Input
                readOnly
                value={`${
                  typeof window !== "undefined" && window.location.origin
                }/sharedbook/${link.id}`}
                className="sm:w-full md:w-4/5"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${
                      typeof window !== "undefined" && window.location.origin
                    }/sharedbook/${link.id}`
                  )
                  setCopyLink(link.id)
                  setTimeout(() => {
                    setCopyLink(undefined)
                  }, 2000)
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copyLink === link.id ? (
                    <motion.div
                      className="flex items-center gap-2 text-green-400 dark:text-green-600"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key="copied"
                    >
                      <CopyCheck className="size-4" />
                      <div className="max-sm:hidden">Скопировано</div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key="copy"
                    >
                      <CopyIcon className="size-4" />
                      <div className="max-sm:hidden">Скопировать</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          ))}
        </div>
        {book.links.length === 0 && (
          <div className="mt-2 text-center">Нет доступных ссылок</div>
        )}
        <Button
          className="mt-2 w-full items-center gap-2"
          disabled={loading}
          onClick={createLink}
        >
          {loading && <Loader invert className="size-4" />}
          Создать ссылку
        </Button>
      </div>
    </DrawerDialog>
  )
}
