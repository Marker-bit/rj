import { authPageHref, authReturnPath } from "@/lib/auth-return-path";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/server-validate-request";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const returnTo = authReturnPath((await searchParams).returnTo);
  const { user } = await validateRequest();

  if (user) {
    return redirect(returnTo);
  }

  return redirect(authPageHref("register", returnTo));
}
