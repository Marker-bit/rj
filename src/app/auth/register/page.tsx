import { cookies } from "next/headers";
import { parseStartPage, START_PAGE_COOKIE } from "@/lib/start-page";
import { authReturnPath } from "@/lib/auth-return-path";
import { RegisterForm } from "./register-form";

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
      <div className="md:rounded-xl p-3 md:border md:max-w-[50vw] md:m-1 max-sm:w-full">
        <h1 className="mb-4 text-2xl font-semibold">Регистрация</h1>
        <RegisterForm returnTo={returnTo} />
      </div>
    </div>
  );
}
