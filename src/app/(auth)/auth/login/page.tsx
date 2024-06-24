import { validateRequest } from "@/lib/server-validate-request"
import { LoginForm } from "./login-form"
import { redirect } from "next/navigation"

export default async function Page() {
  const { user } = await validateRequest()

  if (user) {
    return redirect("/home")
  }

  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <div className="p-3 max-sm:w-full md:m-1 md:max-w-[50vw] md:rounded-xl md:border">
        <LoginForm />
      </div>
    </div>
  )
}
