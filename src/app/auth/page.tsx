import { cookies } from "next/headers";
import { parseStartPage, START_PAGE_COOKIE } from "@/lib/start-page";
import { authPageHref, authReturnPath } from "@/lib/auth-return-path";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/server-validate-request";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const { returnTo: requestedPath } = await searchParams;
  const returnTo =
    requestedPath === undefined
      ? parseStartPage((await cookies()).get(START_PAGE_COOKIE)?.value)
      : authReturnPath(requestedPath);
  const { user } = await validateRequest();

  if (user) {
    return redirect(returnTo);
  }

  return redirect(authPageHref("register", returnTo));
}
