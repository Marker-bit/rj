"use client";

import { CheckIcon, MessageCircleQuestionIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import type { ToolInput, ToolOutput, ToolView } from "@/lib/ai/tools/types";
import { cn } from "@/lib/utils";

type AskUserInput = ToolInput<"askUser">;
type AskUserOutput = ToolOutput<"askUser">;
type AskUserOption = AskUserInput["options"][number];

/**
 * Shortcuts follow the label order: 1-9, then a-z. Only the newest unanswered
 * question reacts to them, so old cards in the history stay inert.
 */
let activeQuestionId: number | null = null;
let questionIdCounter = 0;

function getShortcut(index: number) {
  if (index < 9) {
    return String(index + 1);
  }

  if (index < 9 + 26) {
    return String.fromCharCode(97 + index - 9);
  }

  return undefined;
}

function getPressedShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();

  if (/^[1-9]$/.test(key) || /^[a-z]$/.test(key)) {
    return key;
  }

  const digit = /^Digit([1-9])$/.exec(event.code);
  if (digit) {
    return digit[1];
  }

  const letter = /^Key([A-Z])$/.exec(event.code);
  if (letter) {
    return letter[1].toLowerCase();
  }

  return undefined;
}

function ShortcutKey({
  shortcut,
  overlay = false,
}: {
  shortcut: string;
  overlay?: boolean;
}) {
  return (
    <Kbd
      className={cn(
        "shrink-0",
        overlay && "absolute top-1 left-1 z-10 bg-background/90",
      )}
    >
      {shortcut}
    </Kbd>
  );
}

function ChosenMark({ floating = false }: { floating?: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm",
        floating ? "absolute top-1 right-1" : "ms-auto",
      )}
    >
      <CheckIcon className="size-3" />
    </span>
  );
}

export function AskUserView({
  input,
  output,
  onAnswer,
  inactive = false,
}: {
  input: AskUserInput;
  output?: AskUserOutput;
  onAnswer?: (answer: { value: string; label: string }) => void;
  inactive?: boolean;
}) {
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<number | null>(null);
  if (idRef.current === null) {
    idRef.current = ++questionIdCounter;
  }

  const answered = output !== undefined;
  const locked = answered || pendingAnswer !== null || inactive;
  const chosen = output?.answer ?? pendingAnswer;
  const hasCovers = input.options.some((option) => option.coverUrl);
  const chosenOption = input.options.find(
    (option) => (option.value ?? option.label) === chosen,
  );
  const showAnswerNote = answered && !chosenOption;

  const choose = useCallback(
    (option: AskUserOption) => {
      if (answered || pendingAnswer !== null) {
        return;
      }

      const value = option.value ?? option.label;
      setPendingAnswer(value);
      onAnswer?.({ value, label: option.label });
    },
    [answered, onAnswer, pendingAnswer],
  );

  useEffect(() => {
    if (locked) {
      return;
    }

    activeQuestionId = idRef.current;

    return () => {
      if (activeQuestionId === idRef.current) {
        activeQuestionId = null;
      }
    };
  }, [locked]);

  useEffect(() => {
    if (locked) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        activeQuestionId !== idRef.current ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      // Ignore shortcuts while the chat panel is closed or hidden.
      if (!rootRef.current || rootRef.current.closest("[data-hidden]")) {
        return;
      }

      const pressed = getPressedShortcut(event);
      if (!pressed) {
        return;
      }

      const option = input.options.find(
        (_, index) => getShortcut(index) === pressed,
      );
      if (!option) {
        return;
      }

      event.preventDefault();
      choose(option);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [locked, choose, input.options]);

  return (
    <div
      ref={rootRef}
      className="flex w-full min-w-0 flex-col gap-2 rounded-md border bg-muted/30 p-2.5"
    >
      <div className="flex min-w-0 items-start gap-2">
        <MessageCircleQuestionIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-sm leading-snug font-medium break-words">
            {input.question}
          </p>
          {input.hint && (
            <p className="mt-0.5 text-xs break-words text-muted-foreground">
              {input.hint}
            </p>
          )}
        </div>
      </div>
      <div
        className={cn(
          "grid gap-1.5",
          hasCovers ? "grid-cols-3" : "grid-cols-1",
        )}
      >
        {input.options.map((option, index) => {
          const value = option.value ?? option.label;
          const isChosen = chosen === value;
          const shortcut = getShortcut(index);
          const isMultiLine = Boolean(option.coverUrl || option.description);

          return (
            <button
              key={`${value}:${option.label}`}
              type="button"
              disabled={locked}
              aria-keyshortcuts={!locked ? shortcut : undefined}
              onClick={() => choose(option)}
              className={cn(
                "relative flex min-w-0 flex-col items-stretch gap-1 rounded-md border bg-background p-1.5 text-left text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default",
                !locked &&
                  "cursor-pointer transition-colors hover:border-ring/60 hover:bg-accent/50",
                isChosen && "border-primary bg-primary/5",
                !locked &&
                  isChosen &&
                  "hover:border-primary hover:bg-primary/5",
              )}
            >
              {option.coverUrl && (
                <>
                  <Image
                    src={option.coverUrl}
                    alt=""
                    width={96}
                    height={144}
                    unoptimized
                    className="aspect-[2/3] w-full rounded-sm border object-cover"
                  />
                  {!locked && shortcut && (
                    <ShortcutKey shortcut={shortcut} overlay />
                  )}
                </>
              )}
              <span className="flex min-w-0 items-center gap-1.5 font-medium">
                {!option.coverUrl && !locked && shortcut && (
                  <ShortcutKey shortcut={shortcut} />
                )}
                <span className="min-w-0 break-words">{option.label}</span>
                {isChosen && !isMultiLine && <ChosenMark />}
              </span>
              {option.description && (
                <span className="min-w-0 text-muted-foreground break-words">
                  {option.description}
                </span>
              )}
              {isChosen && isMultiLine && <ChosenMark floating />}
            </button>
          );
        })}
      </div>
      {showAnswerNote ? (
        <p className="text-xs text-muted-foreground">
          Ответ: <span className="text-foreground">{output.answer}</span>
        </p>
      ) : (
        !locked && (
          <p className="text-[11px] text-muted-foreground/70">
            Выберите клавишей или напишите свой вариант в поле ниже.
          </p>
        )
      )}
    </div>
  );
}

const AskUserOutputView = ({
  input,
  output,
}: {
  input: AskUserInput;
  output: AskUserOutput;
}) => <AskUserView input={input} output={output} />;

export const askUserToolView: ToolView<"askUser"> = {
  title: "Задать вопрос",
  texts: {
    loadingText: "Готовит вопрос...",
    successText: "Ответ получен",
    approvalText: "Хочет задать вопрос",
    deniedText: "Вопрос отклонён",
    unansweredText: "Вопрос без ответа",
  },
  icon: MessageCircleQuestionIcon,
  outputView: AskUserOutputView,
};
