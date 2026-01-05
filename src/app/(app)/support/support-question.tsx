"use client";

import type {
  AnswerRead,
  SupportAnswer,
  SupportQuestion,
  User,
} from "@prisma/client";
import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";
import type { User as LuciaUser } from "lucia";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, declOfNum } from "@/lib/utils";
import AnswerQuestion from "./answer-question";
import QuestionAnswer from "./question-answer";

export default function SupportQuestionCard({
  question,
  currentUser,
}: {
  question: SupportQuestion & {
    answers: (SupportAnswer & { fromUser: User; read: AnswerRead[] })[];
  };
  currentUser: LuciaUser;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const unreadAnswers = question.answers.filter(
    (a) => !a.read.find((r) => r.userId === currentUser.id),
  );

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-xl border p-4">
      {/* <div className="flex items-center gap-2 text-muted-foreground">
        от
        <Image
          src={currentUser.avatarUrl}
          alt="avatar"
          width={30}
          height={30}
          className="rounded-full"
        />
        вас
      </div> */}
      <div className="text-xl font-bold">{question.title}</div>
      <div className="text-sm text-muted-foreground">{question.content}</div>
      <div className="text-xs text-muted-foreground">
        создан {formatRelative(question.date, new Date(), { locale: ru })}
      </div>
      <div className="absolute right-5 top-5 text-sm text-muted-foreground sm:translate-x-full sm:opacity-0 sm:transition-all sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
        {question.isDone && "выполнено · "}
        {question.answers.length}{" "}
        {declOfNum(question.answers.length, ["ответ", "ответа", "ответов"])}
      </div>
      {/* {question.answers.length > 0 && ( */}
      <Button
        variant="outline"
        size="sm"
        className="mt-2 flex items-center gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Открыть диалог
        <ChevronDown
          className={cn("size-4 transition", isExpanded && "rotate-180")}
        />
        {unreadAnswers.length > 0 && (
          <Badge>
            {unreadAnswers.length}{" "}
            {declOfNum(unreadAnswers.length, [
              "новый ответ",
              "новых ответа",
              "новых ответов",
            ])}
          </Badge>
        )}
      </Button>
      {/* )} */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mt-2 flex flex-col gap-2">
              {question.answers.map((answer) => (
                <QuestionAnswer
                  key={answer.id}
                  answer={answer}
                  currentUserId={currentUser.id}
                />
              ))}
              <AnswerQuestion questionId={question.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
