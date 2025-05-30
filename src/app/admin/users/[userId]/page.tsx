import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { BadgeCheck, Ban, KeyRound } from "lucide-react"
import { notFound } from "next/navigation"
import BadgeCheckButton from "./badge-check-button";
import PasswordUpdateButton from "./password-update";

export default async function Page(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
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
          <Ban />
          Удалить аккаунт
        </Button>
        <PasswordUpdateButton userId={user.id} />
      </div>
    </div>
  )
}
