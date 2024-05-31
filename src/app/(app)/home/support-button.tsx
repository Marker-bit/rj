import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { validateRequest } from "@/lib/server-validate-request"
import { MessageCircleQuestion } from "lucide-react"
import Link from "next/link"

export default async function SupportButton() {
  const { user } = await validateRequest()
  const unread = await db.supportAnswer.count({
    where: {
      fromUserId: user?.id,
      read: {
        none: {
          userId: user?.id,
        },
      },
    },
  })
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/support">
        {unread > 0 ? (
          <div className="flex size-6 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
            {unread}
          </div>
        ) : (
          <MessageCircleQuestion className="size-6" />
        )}
      </Link>
    </Button>
  )
}
