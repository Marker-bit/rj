"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function CloneButton({ linkId }: { linkId: string }) {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const cloneBook = async () => {
    setLoading(true)
    const res = await fetch(`/api/links/${linkId}/clone`, {
      method: "POST",
    })
    const data = await res.json()

    if (data.error) {
      toast.error("Что-то пошло не так", {
        description: data.error,
      })
    } else {
      toast.success("Книга скопирована", {
        description: "Теперь вы можете её читать",
        action: {
          label: "Перейти",
          onClick: () => router.push(`/books?bookId=${data.bookId}`),
        },
      })
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button variant="ghost" onClick={cloneBook} className="flex items-center gap-2">
      {loading ? (
        <Loader className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
      Копировать книгу
    </Button>
  )
}
