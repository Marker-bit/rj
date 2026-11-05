import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const options = [
  'Добавь книгу "Война и мир"',
  "Предложи мне книгу, основываясь на моих предпочтениях",
  "Помоги мне найти книгу по ключевому слову",
];

export function EmptyView({
  setMessage,
}: {
  setMessage: (message: string) => void;
}) {
  return (
    <Empty className="size-full gap-4 overflow-y-auto p-3 md:p-3">
      <EmptyHeader className="gap-1.5">
        <EmptyMedia variant="icon">
          <MessageCircleIcon />
        </EmptyMedia>
        <EmptyTitle className="text-base">Чат с ИИ</EmptyTitle>
        <EmptyDescription className="text-xs">
          Искусственный интеллект поможет вам найти подходящую книгу, добавить
          новую и изменить существующую.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant="outline"
            size="sm"
            className="h-auto w-full justify-start py-2 text-left text-xs whitespace-normal"
            onClick={() => setMessage(option)}
          >
            {option}
          </Button>
        ))}
      </EmptyContent>
    </Empty>
  );
}
