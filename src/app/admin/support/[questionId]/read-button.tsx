"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader";
import { Router } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function ReadButton({
  answerId,
  read,
}: {
  answerId: string
  read: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <Button
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true)
        const res = await fetch(`/api/support/answer/${answerId}/read`, {
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
      {loading && <Loader className="mr-2 size-4" />}
      {read ? "Отметить как непрочитанное" : "Отметить как прочитанное"}
    </Button>
  )
}
