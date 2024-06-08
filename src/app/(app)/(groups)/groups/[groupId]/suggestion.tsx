import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { GroupBookSuggestion, GroupMemberRole } from "@prisma/client"
import { Plus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function Suggestion({
  suggestion,
  role,
}: {
  suggestion: GroupBookSuggestion
  role: GroupMemberRole
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onClick = () => {
    setLoading(true)
    fetch(`/api/groups/${suggestion.groupId}/suggestion/${suggestion.id}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false)
        if (res.error) {
          toast.error("Возникла проблема при предложении книги", {
            description: res.error,
          })
        } else {
          toast.success(res.message)
          router.refresh()
        }
      })
  }
  return (
    <div className="flex gap-2">
      {suggestion.coverUrl && (
        <Image
          src={suggestion.coverUrl}
          alt="book cover"
          width={48}
          height={48}
          className="size-12 rounded-md"
        />
      )}
      <div className="flex flex-col">
        <div className="text-lg font-bold">{suggestion.title}</div>
        <div className="text-sm text-muted-foreground">{suggestion.author}</div>
        <div className="text-sm text-muted-foreground">
          {suggestion.description}
        </div>
      </div>
      {role !== GroupMemberRole.MEMBER && (
        <Button
          variant="ghost"
          className="ml-auto"
          size="icon"
          onClick={onClick}
        >
          {loading ? (
            <Loader className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      )}
    </div>
  )
}
