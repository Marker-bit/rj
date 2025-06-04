import { db } from "@/lib/db";
import { validateRequest } from "@/lib/server-validate-request";
import SupportQuestionCard from "./support-question";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion } from "lucide-react";
import AskQuestion from "./ask-question";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) return;

  const questions = await db.supportQuestion.findMany({
    where: {
      fromUserId: user.id,
    },
    include: {
      answers: {
        include: {
          fromUser: true,
          read: true,
        },
      },
    },
  });

  return (
    <div className="m-2 flex flex-col items-start gap-2 max-sm:mb-[15vh]">
      <h1 className="text-3xl font-bold">Поддержка</h1>
      <AskQuestion />
      {questions.map((question) => (
        <SupportQuestionCard
          currentUser={user}
          key={question.id}
          question={question}
        />
      ))}
    </div>
  );
}
