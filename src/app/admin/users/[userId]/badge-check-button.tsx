"use client"

import { Button } from "@/components/ui/button"
import { setVerification } from "@/lib/actions/users"
import { BadgeCheck } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner"

export default function BadgeCheckButton({
  userId,
  isVerified,
}: {
  userId: string
  isVerified: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const changeVerification = async () => {
    toast.promise(
      async () => {
        setLoading(true)
        await setVerification(userId, !isVerified)
        setLoading(false)
        router.refresh()
      },
      {
        loading: "Подождите...",
        success: "Подтверждение задано",
        error: "Не удалось задать подтверждение",
      }
    )
  }
  return isVerified ? (
    <Button disabled={loading} onClick={changeVerification}>
      <BadgeCheck className="mr-2 size-4" />
      Снять подтверждение
    </Button>
  ) : (
    <Button disabled={loading} onClick={changeVerification}>
      <BadgeCheck className="mr-2 size-4" />
      Подтвердить
    </Button>
  )
}
