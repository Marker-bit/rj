"use client";

import { Check, MoreVertical, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteQuestion, markAsDone } from "@/lib/actions/support";

export default function QuestionButtons({
  question,
}: {
  question: { id: string; isDone: boolean };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteClick = async () => {
    toast.promise(
      async () => {
        setLoading(true);
        await deleteQuestion(question.id);
        setLoading(false);
        router.replace("/admin/support");
      },
      {
        loading: "Удаление...",
        success: "Вопрос удален",
        error: "Не удалось удалить вопрос",
      },
    );
  };

  const markClick = async () => {
    toast.promise(
      async () => {
        setLoading(true);
        await markAsDone(question.id, !question.isDone);
        setLoading(false);
        router.refresh();
      },
      {
        loading: "Изменение статуса...",
        success: "Статус изменен",
        error: "Не удалось изменить статус",
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit gap-2">
          <MoreVertical className="size-4" />
          Действия
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={deleteClick} disabled={loading}>
          <Trash /> Удалить
        </DropdownMenuItem>
        {question.isDone ? (
          <DropdownMenuItem onClick={markClick} disabled={loading}>
            <X /> Пометить как не выполненное
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={markClick} disabled={loading}>
            <Check /> Пометить как выполненное
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
