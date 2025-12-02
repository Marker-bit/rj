import { MessageCircleIcon } from "lucide-react";

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
    <div className="size-full flex flex-col items-center justify-center p-2">
      <div className="rounded-md border p-2 flex items-center justify-center">
        <MessageCircleIcon className="size-6 text-muted-foreground" />
      </div>
      <div className="text-xl font-bold">Чат с ИИ</div>
      <div className="text-sm text-muted-foreground text-center">
        Искусственный интеллект поможет вам найти подходящую книгу, добавить
        новую и изменить существующую.
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setMessage(option)}
            className="border rounded-xl px-4 py-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-all text-sm"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
