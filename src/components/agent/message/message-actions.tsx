import type { UIMessage } from "ai";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCopyableMessageText } from "@/lib/ai/utils";
import { cn } from "@/lib/utils";

export function MessageActions({
  className,
  message,
  ...props
}: {
  message: UIMessage;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "scale-90 pointer-events-none opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto origin-bottom-right absolute bg-popover rounded-md p-0.5 border transition-all text-muted-foreground",
        className,
        message.role === "user"
          ? "flex-row top-0 left-0 -translate-y-5/8 -translate-x-5/8"
          : "flex-row-reverse top-0 right-0 -translate-y-5/8 translate-x-5/8",
      )}
      {...props}
    >
      <Button
        size="icon-xs"
        variant="ghost"
        className="active:scale-90"
        onClick={() => {
          try {
            const text = getCopyableMessageText(message);
            navigator.clipboard.writeText(text);
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
      </Button>
      <Button size="icon-xs" variant="ghost" className="active:scale-90">
        <RefreshCcw />
      </Button>
    </div>
  );
}
