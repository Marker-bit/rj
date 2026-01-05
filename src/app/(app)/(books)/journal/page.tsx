import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import JournalView from "./journal-view";

export default async function JournalPage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/auth/login");
  }

  const events = await db.readEvent.findMany({
    where: {
      book: {
        userId: user.id,
      },
    },
    include: {
      book: true,
    },
    orderBy: {
      readAt: "desc",
    },
  });

  return <JournalView events={events} />;
}
