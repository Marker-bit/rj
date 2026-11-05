import type { UIMessage } from "ai";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  getCopyableAnswerText,
  getCopyableMessageText,
  getMessageTextParts,
} from "@/lib/ai/utils";

async function copyToClipboard(getText: () => string, successMessage: string) {
  try {
    const text = getText();
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch (e: any) {
    console.error(e);
    if (e instanceof Error) {
      toast.error("Не удалось скопировать сообщение", {
        description: e.message,
      });
    } else {
      toast.error("Не удалось скопировать сообщение");
    }
  }
}

export function MessageContextMenu({
  children,
  message,
  canRegenerate,
  isStreaming,
  onRegenerate,
  onContextMenu,
  ...props
}: {
  onRegenerate: () => void;
  message: UIMessage;
  canRegenerate: boolean;
  isStreaming: boolean;
} & React.ComponentPropsWithRef<typeof ContextMenuTrigger>) {
  const [textPartIndex, setTextPartIndex] = useState<number | null>(null);
  const hasText = getMessageTextParts(message).length > 0;

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (!open) {
          setTextPartIndex(null);
        }
      }}
    >
      <ContextMenuTrigger
        {...props}
        onContextMenu={(event) => {
          const target = event.target;
          const textPartElement =
            target instanceof Element
              ? target.closest<HTMLElement>("[data-message-text-part]")
              : null;
          const index = textPartElement?.dataset.messageTextPart;

          setTextPartIndex(index === undefined ? null : Number(index));
          onContextMenu?.(event);
        }}
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="z-110">
        <ContextMenuItem
          disabled={!hasText}
          onClick={() =>
            void copyToClipboard(
              () => getCopyableMessageText(message, textPartIndex),
              "Сообщение скопировано",
            )
          }
        >
          <CopyIcon />
          Скопировать сообщение
        </ContextMenuItem>
        {message.role === "assistant" && hasText && (
          <ContextMenuItem
            disabled={isStreaming}
            onClick={() =>
              void copyToClipboard(
                () => getCopyableAnswerText(message),
                "Ответ скопирован",
              )
            }
          >
            <CopyIcon />
            Скопировать ответ
          </ContextMenuItem>
        )}
        {hasText && <ContextMenuSeparator />}
        <ContextMenuItem onClick={onRegenerate} disabled={!canRegenerate}>
          <RefreshCcw />
          Повторить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
