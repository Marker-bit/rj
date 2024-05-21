import { validateRequest } from "@/lib/server-validate-request"
import { UserButton } from "./user-button";

export async function UserBar() {
  const { user } = await validateRequest()
  if (!user) return null

  return <UserButton user={user} />
}
