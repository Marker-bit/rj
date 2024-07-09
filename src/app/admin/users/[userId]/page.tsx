import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { BadgeCheck, Ban, KeyRound } from "lucide-react"
import { notFound } from "next/navigation"
import BadgeCheckButton from "./badge-check-button";
import PasswordUpdateButton from "./password-update";

export default async function Page({ params }: { params: { userId: string } }) {
  const user = await db.user.findFirst({
    where: {
      id: params.userId,
    },
  })
  if (!user) {
    return notFound()
  }
  return (
    <div className="m-2 flex flex-col gap-2">
      <div className="font-mono text-sm">{user.id}</div>
      <h1 className="text-3xl font-bold">
        {user.firstName} {user.lastName}
      </h1>
      <div className="text-sm text-muted-foreground">@{user.username}</div>

      <div className="flex flex-wrap gap-2">
        <BadgeCheckButton isVerified={user.verified} userId={user.id} />
        <Button variant="outline">
          <Ban className="mr-2 size-4" />
          Удалить аккаунт
        </Button>
        <PasswordUpdateButton userId={user.id} />
      </div>
    </div>
  )
}
