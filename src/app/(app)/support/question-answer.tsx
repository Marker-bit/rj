import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { markAsRead } from "@/lib/actions/support";
import { AnswerRead, SupportAnswer, User } from "@prisma/client";
import { CheckCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const read = async () => {
    setReadLoading(true);
    await markAsRead(answer.id);
    setReadLoading(false);
    router.refresh();
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
