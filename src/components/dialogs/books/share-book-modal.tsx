"use client"

import { DrawerDialog } from "@/components/ui/drawer-dialog"
import { DialogHeader, DialogTitle } from "../../ui/dialog"
import { CopyCheck, CopyIcon, Settings, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { AnimatePresence, motion } from "framer-motion"
import { Book } from "@/lib/api-types"
import { Loader } from "../../ui/loader"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteBookLink } from "@/lib/actions/books"

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

  const deleteLink = async (id: string) => {
    toast.promise(async () => {
      setLoading(true)
      const resp = await deleteBookLink(id)
      setLoading(false)
      router.refresh()
    }, {
      loading: "Удаление ссылки...",
      success: "Ссылка удалена",
      error: "Возникла проблема при удалении ссылки",
    })
  }

  return (
    <DrawerDialog
      open={open}
      onOpenChange={setOpen}
      className="md:w-[50vw] lg:w-[40vw]"
    >
      <DialogHeader>
        <DialogTitle>Ссылки</DialogTitle>
      </DialogHeader>
      <div className="mt-2">
        <div className="flex flex-col items-stretch gap-2">
          {book.links.map((link) => (
            <div className="flex w-full gap-2" key={link.id}>
              <Input
                readOnly
                value={`${
                  typeof window !== "undefined" && window.location.origin
                }/sharedbook/${link.id}`}
                className="w-full"
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
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      key="copied"
                    >
                      <CopyCheck className="size-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      key="copy"
                    >
                      <CopyIcon className="size-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
              <Button onClick={() => deleteLink(link.id)} disabled={loading} variant="outline">
                <Trash className="size-4" />
              </Button>
              <Button onClick={() => toast.info("В разработке")} disabled={loading} variant="outline">
                <Settings className="size-4" />
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
