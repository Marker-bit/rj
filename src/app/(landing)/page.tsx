import { validateRequest } from "@/lib/server-validate-request"
import { redirect } from "next/navigation"
import { Landing } from "./landing"

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { user } = await validateRequest()
  if (user && searchParams?.noRedirect !== "") return redirect("/home")

  return <Landing loggedIn={!!user} />
}
