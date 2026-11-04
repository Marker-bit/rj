import { redirect } from "next/navigation";
import { validateRequest } from "./server-validate-request";

export async function requireUser() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}
