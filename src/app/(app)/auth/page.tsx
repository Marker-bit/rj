import { validateRequest } from "@/lib/server-validate-request";
import { AuthForm } from "./auth-form";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/home");
  }

  return (
    <div className="flex md:min-h-screen md:items-center md:justify-center">
      <div className="md:rounded-xl p-3 md:border md:border-zinc-200 md:max-w-[50vw] md:m-1 max-sm:w-full">
        <AuthForm />
      </div>
    </div>
  );
}
