import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { getCopyableMessageText } from "@/lib/ai/utils";
import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export function MessageContextMenu({
  children,
  message,
  onRegenerate,
  ...props
}: {
  onRegenerate: () => void;
  message: UIMessage;
} & React.ComponentPropsWithRef<typeof ContextMenuTrigger>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger {...props}>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            try {
              const text = getCopyableMessageText(message);
              navigator.clipboard.writeText(text);
              toast.success("Сообщение скопировано");
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
          }}
        >
          <CopyIcon />
          Скопировать сообщение
        </ContextMenuItem>
        <ContextMenuItem onClick={onRegenerate}>
          <RefreshCcw />
          Повторить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
