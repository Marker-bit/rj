import { cookies } from "next/headers";
import { parseStartPage, START_PAGE_COOKIE } from "@/lib/start-page";
import { authReturnPath } from "@/lib/auth-return-path";
import { NewWebsiteWarning } from "@/components/new-website-warning";
import { LoginForm } from "./login-form";

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
  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <div className="flex flex-col gap-2 max-sm:w-full md:max-w-[50vw] md:m-1">
        <NewWebsiteWarning className="w-full max-w-full" />
        <div className="p-3 md:rounded-xl md:border">
          <h1 className="mb-4 text-2xl font-semibold">Вход</h1>
          <LoginForm returnTo={returnTo} />
        </div>
      </div>
    </div>
  );
}
