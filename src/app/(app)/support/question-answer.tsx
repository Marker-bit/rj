import type {
  AnswerRead,
  SupportAnswer,
  User,
} from "@/generated/prisma/client";
import { CheckCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { markAsRead } from "@/lib/actions/support";
import { revalidate } from "@/lib/actions/revalidate";

export default function QuestionAnswer({
  answer,
  currentUserId,
}: {
  answer: SupportAnswer & {
    fromUser: User;
    read: AnswerRead[];
  };
  currentUserId: string;
}) {
  const [readLoading, setReadLoading] = useState(false);
  const read = async () => {
    setReadLoading(true);
    try {
      await markAsRead(answer.id);
      void revalidate("support");
    } catch {
      toast.error("Не удалось выполнить действие", {
        description: "Проверьте соединение и попробуйте ещё раз.",
      });
    } finally {
      setReadLoading(false);
    }
  };
  return (
    <div
      className="flex flex-col gap-2 rounded-xl border p-2 hover:shadow-xs"
      key={answer.id}
    >
      <div className="flex items-center gap-2">
        {answer.fromUser.avatarUrl && (
          <Image
            src={answer.fromUser.avatarUrl}
            alt="avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
        )}

        <div className="flex flex-col">
          <div className="font-bold">
            {answer.fromUser.firstName} {answer.fromUser.lastName}
          </div>
          <div className="text-sm text-muted-foreground">
            @{answer.fromUser.username}
          </div>
        </div>
      </div>
      <div className="text-sm">{answer.content}</div>
      <Button
        className="flex w-fit items-center gap-2"
        variant="outline"
        onClick={read}
        disabled={readLoading}
      >
        {readLoading ? (
          <Loader className="size-4" />
        ) : (
          <CheckCheck className="size-4" />
        )}
        {answer.read.find((r) => r.userId === currentUserId)
          ? "Не прочитан"
          : "Прочитан"}
      </Button>
    </div>
  );
}
