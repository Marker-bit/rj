import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";

export default async function SupportButton() {
  const { user } = await validateRequest();
  if (!user) return null;
  const unread = await db.supportAnswer.count({
    where: {
      read: {
        none: {
          userId: user?.id,
        },
      },
      question: {
        fromUserId: user?.id,
      },
    },
  });
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/support">
        {unread > 0 ? (
          <div className="flex size-[1.2rem] items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
            {unread}
          </div>
        ) : (
          <MessageCircleQuestion className="size-[1.2rem]" />
        )}
      </Link>
    </Button>
  );
}
