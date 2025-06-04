import { validateRequest } from "@/lib/server-validate-request";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/home");
  }

  return redirect("/auth/register");
}
