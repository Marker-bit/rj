import { validateRequest } from "@/lib/server-validate-request";
import { redirect, useSearchParams } from "next/navigation";

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { user } = await validateRequest();
  if (user && searchParams?.noRedirect !== "") return redirect("/home");

  return <div className="m-2">Landing</div>;
}
