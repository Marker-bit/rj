import { authReturnPath } from "@/lib/auth-return-path";
import { RegisterForm } from "./register-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const returnTo = authReturnPath((await searchParams).returnTo);
  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <div className="md:rounded-xl p-3 md:border md:max-w-[50vw] md:m-1 max-sm:w-full">
        <RegisterForm returnTo={returnTo} />
      </div>
    </div>
  );
}
