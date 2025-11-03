import { ChatHistory } from "@/components/agent/chat-history";
import { MessageInput } from "@/components/agent/message-input";
import { Button } from "@/components/ui/button";
import { MyUIMessage } from "@/lib/ai/message";
import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { XIcon } from "lucide-react";

export function AgentPopover({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { messages, sendMessage, error, status, regenerate } =
    useChat<MyUIMessage>({
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    });

  return (
    <div
      className="border bg-popover text-popover-foreground rounded-md origin-bottom-right data-[hidden]:opacity-0 data-[hidden]:scale-95 data-[hidden]:pointer-events-none transition-all h-[30rem] max-h-[30rem] w-80 grid grid-rows-[auto_1fr_auto] overflow-y-hidden"
      data-hidden={!isOpen || undefined}
    >
      <div className="p-1 pl-3 pr-2 border-b flex items-center justify-between shrink-0">
        <div className="font-medium text-sm">Чат с ИИ</div>
        <Button
          size="icon-sm"
          variant="ghost"
          className="size-6"
          onClick={onClose}
        >
          <XIcon />
        </Button>
      </div>
      <ChatHistory
        messages={messages}
        error={error}
        status={status}
        onRetry={() => regenerate()}
        onRegenerate={(messageId) => regenerate({ messageId })}
      />
      <MessageInput onSend={(message) => sendMessage({ text: message })} />
    </div>
  );
}
