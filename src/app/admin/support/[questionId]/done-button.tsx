"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function DoneButton({
  questionId,
  done,
}: {
  questionId: string
  done: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true)
        const res = await fetch(`/api/support/${questionId}/done`, {
          method: "POST",
        })
        setLoading(false)
        if (!res.ok) {
          toast.error("Что-то пошло не так")
        }
        router.refresh()
      }}
      className="w-fit"
    >
      {loading ? (
        <Loader invert className="mr-2 size-4" />
      ) : done ? (
        <X className="mr-2 size-4" />
      ) : (
        <Check className="mr-2 size-4" />
      )}
      {done ? "Отметить как не выполненное" : "Отметить как выполненное"}
    </Button>
  )
}
