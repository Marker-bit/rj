import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/page-metadata";
import { validateRequest } from "@/lib/server-validate-request";
import JournalView from "./journal-view";

export const metadata = pageMetadata("Журнал");

export default async function JournalPage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/auth/login");
  }

  return <JournalView userId={user.id} />;
}
