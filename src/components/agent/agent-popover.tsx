import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { Maximize2Icon, Minimize2Icon, Trash2Icon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import posthog from "posthog-js";
import { useCallback, useMemo, useRef, useState } from "react";
import { ChatHistory } from "@/components/agent/chat-history";
import { EmptyView } from "@/components/agent/empty-view";
import {
  MessageInput,
  type MessageInputRef,
} from "@/components/agent/message-input";
import { useToolSelection } from "@/components/agent/message-input/tool-selector";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { MyUIMessage } from "@/lib/ai/message";
import { readDefaultFields } from "@/lib/default-fields";
import { cn } from "@/lib/utils";

export function AgentPopover({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isFullHeight, setIsFullHeight] = useState(false);
  const isMobile = useIsMobile();

  const ref = useRef<MessageInputRef>(null);
  const suppressAutoSend = useRef(false);

  const sendAutomaticallyWhen = useCallback(
    ({ messages: nextMessages }: { messages: MyUIMessage[] }) => {
      if (suppressAutoSend.current) {
        return false;
      }

      return (
        lastAssistantMessageIsCompleteWithToolCalls({
          messages: nextMessages,
        }) ||
        lastAssistantMessageIsCompleteWithApprovalResponses({
          messages: nextMessages,
        })
      );
    },
    [],
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        prepareSendMessagesRequest: ({ ...data }) => {
          return {
            body: {
              ...data,
              allowedTools: useToolSelection.getState().allowedTools ?? [],
              defaultFields: readDefaultFields(),
            },
          };
        },
      }),
    [],
  );

  const {
    messages,
    sendMessage,
    error,
    status,
    regenerate,
    setMessages,
    stop,
    clearError,
    addToolApprovalResponse,
    addToolResult,
  } = useChat<MyUIMessage>({
    sendAutomaticallyWhen,
    transport,
  });

  const sendWithDenial = useCallback(
    async (text: string) => {
      const pendingApprovalIds = messages.flatMap((message) =>
        message.parts.flatMap((part) =>
          isToolUIPart(part) &&
          part.state === "approval-requested" &&
          part.approval
            ? [part.approval.id]
            : [],
        ),
      );

      if (pendingApprovalIds.length > 0) {
        // Deny pending approvals with the message as the reason, then send the
        // message in the same request instead of continuing without context.
        suppressAutoSend.current = true;
        try {
          await Promise.all(
            pendingApprovalIds.map((id) =>
              addToolApprovalResponse({
                id,
                approved: false,
                reason: text,
              }),
            ),
          );
        } catch {
          // Send the message even if the denial could not be applied.
        } finally {
          suppressAutoSend.current = false;
        }
      }

      sendMessage({ text });
    },
    [addToolApprovalResponse, messages, sendMessage],
  );

  const answerQuestion = useCallback(
    ({
      toolCallId,
      answer,
      label,
    }: {
      toolCallId: string;
      answer: string;
      label: string;
    }) => {
      void addToolResult({
        tool: "askUser",
        toolCallId,
        output: { answer, label },
      });
    },
    [addToolResult],
  );

  const clearChat = () => {
    stop();
    setMessages([]);
    clearError();
    ref.current?.setMessage("");
  };

  return (
    <div
      className={cn(
        "border bg-popover text-popover-foreground rounded-md origin-bottom-right data-hidden:opacity-0 data-hidden:scale-95 transition-all h-screen grid grid-rows-[auto_1fr_auto] overflow-hidden max-sm:w-full max-sm:rounded-none max-sm:border-0 max-sm:origin-bottom",
        isFullHeight ? "w-100" : "w-80",
      )}
      style={{
        height: isMobile
          ? "calc(100dvh - env(safe-area-inset-top))"
          : undefined,
        maxHeight: isMobile
          ? "calc(100dvh - env(safe-area-inset-top))"
          : isFullHeight
            ? "calc(100vh - 140px)"
            : "30rem",
      }}
      data-hidden={!isOpen || undefined}
      inert={!isOpen}
      aria-hidden={!isOpen}
    >
      <div className="p-1 pl-3 pr-2 border-b flex items-center justify-between shrink-0">
        <div className="font-medium text-sm">Чат с ИИ</div>
        <div className="flex gap-2 items-center">
          <Button
            size="icon-sm"
            variant="ghost"
            className="size-6"
            onClick={clearChat}
            disabled={messages.length === 0 && !error}
            aria-label="Очистить чат"
          >
            <Trash2Icon />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className={cn("size-6", isMobile && "hidden")}
            onClick={() => setIsFullHeight((a) => !a)}
            aria-label={isFullHeight ? "Свернуть чат" : "Развернуть чат"}
          >
            {isFullHeight ? <Minimize2Icon /> : <Maximize2Icon />}
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="size-6"
            onClick={onClose}
            aria-label="Закрыть чат"
          >
            <XIcon />
          </Button>
        </div>
      </div>
      <div className="h-full relative flex flex-col min-h-0 overflow-x-hidden">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{
                x: "-100%",
                opacity: 0,
                filter: "blur(6px)",
                scale: 0.7,
              }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{
                x: "-100%",
                opacity: 0,
                filter: "blur(6px)",
                scale: 0.7,
              }}
              transition={{ duration: 0.5, bounce: 0.1, type: "spring" }}
              key="empty"
              className="size-full"
            >
              <EmptyView setMessage={(text) => ref.current?.setMessage(text)} />
            </motion.div>
          ) : (
            <motion.div
              initial={{
                x: "-100%",
                opacity: 0,
                filter: "blur(6px)",
                scale: 0.7,
              }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{
                x: "-100%",
                opacity: 0,
                filter: "blur(6px)",
                scale: 0.7,
              }}
              transition={{ duration: 0.5, bounce: 0.1, type: "spring" }}
              key="chat"
              className="size-full"
            >
              <ChatHistory
                messages={messages}
                error={error}
                status={status}
                onRetry={() => regenerate()}
                onRegenerate={(messageId) => regenerate({ messageId })}
                addToolApprovalResponse={addToolApprovalResponse}
                onAnswer={answerQuestion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <MessageInput
        ref={ref}
        status={status}
        onSend={(message) => {
          void sendWithDenial(message);
          posthog.capture("ai_message_sent", {
            length: message.length,
          });
        }}
      />
    </div>
  );
}
