import { redirect } from "next/navigation";
import { authPageHref, authReturnPath } from "./auth-return-path";
import { validateRequest } from "./server-validate-request";

export async function requireUser(returnTo?: string) {
  const { user } = await validateRequest();

  if (!user) {
    redirect(
      returnTo
        ? authPageHref("login", authReturnPath(returnTo))
        : "/auth/login",
    );
  }

  return user;
}
