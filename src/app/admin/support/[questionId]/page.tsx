import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Image from "next/image";
import ReadButton from "./read-button";
import AnswerQuestion from "@/app/(app)/support/answer-question";
import { validateRequest } from "@/lib/server-validate-request";
import QuestionButtons from "./question-buttons";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ questionId: string }>;
}) {
  const params = await props.params;
  const { user } = await validateRequest();
  if (!user || !user.admin) return null;
  const question = await db.supportQuestion.findUnique({
    where: { id: params.questionId },
    include: {
      answers: { include: { fromUser: true, read: true } },
      fromUser: true,
    },
  });
  if (!question) return notFound();
  return (
    <div className="m-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {question.fromUser.avatarUrl && (
          <Image
            src={question.fromUser.avatarUrl}
            alt={"avatar"}
            width={48}
            height={48}
            className="size-10 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <div>
            {question.fromUser.firstName} {question.fromUser.lastName}
          </div>
          <div className="text-muted-foreground">
            @{question.fromUser.username}
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold">{question.title}</h1>
      <div>{question.content}</div>
      <QuestionButtons question={question} />

      <div>
        {question.answers.map((answer) => (
          <div key={answer.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {answer.fromUser.avatarUrl && (
                <Image
                  src={answer.fromUser.avatarUrl}
                  alt={"avatar"}
                  width={48}
                  height={48}
                  className="size-10 rounded-full"
                />
              )}
              <div className="flex flex-col">
                <div>
                  {answer.fromUser.firstName} {answer.fromUser.lastName}
                </div>
                <div className="text-muted-foreground">
                  @{answer.fromUser.username}
                </div>
              </div>
            </div>
            <div>{answer.content}</div>
            <ReadButton
              answerId={answer.id}
              read={!!answer.read.find((r) => r.userId === user.id)}
            />
          </div>
        ))}
        <AnswerQuestion questionId={question.id} />
      </div>
    </div>
  );
}
