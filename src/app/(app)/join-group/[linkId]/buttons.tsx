"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

export function JoinGroupButton({ linkId }: { linkId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  return (
    <Button
      className="items-center gap-2"
      disabled={loading}
      onClick={() => toast.promise(async () => {
        setLoading(true)

        const res = await fetch(`/api/join-group/${linkId}`, {
          method: "POST",
        });

        const json = await res.json()
        setLoading(false)
        if (!json.groupId) return;

        router.push(`/groups/${json.groupId}`)
      }, {
        loading: "Вход в группу...",
        success: "Вы вступили в группу",
        error: "Произошла ошибка при входе в группу",
      })}
    >
      <Check className="size-4" />
      Принять
    </Button>
  )
}
