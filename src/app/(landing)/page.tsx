import { validateRequest } from "@/lib/server-validate-request"
import { redirect } from "next/navigation"
import { Landing } from "./landing"

export default async function LandingPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const { user } = await validateRequest()
  if (user && searchParams?.noRedirect !== "") return redirect("/home")

  return <Landing loggedIn={!!user} />
}
