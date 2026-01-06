import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import posthog from "posthog-js";
import { useRef } from "react";
import { ChatHistory } from "@/components/agent/chat-history";
import { EmptyView } from "@/components/agent/empty-view";
import {
  MessageInput,
  type MessageInputRef,
} from "@/components/agent/message-input";
import { useToolSelection } from "@/components/agent/message-input/tool-selector";
import { Button } from "@/components/ui/button";
import type { MyUIMessage } from "@/lib/ai/message";

export function AgentPopover({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const ref = useRef<MessageInputRef>(null);

  const {
    messages,
    sendMessage,
    error,
    status,
    regenerate,
    addToolApprovalResponse,
  } = useChat<MyUIMessage>({
    sendAutomaticallyWhen: ({ messages }) =>
      lastAssistantMessageIsCompleteWithToolCalls({ messages }) ||
      lastAssistantMessageIsCompleteWithApprovalResponses({ messages }),
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ ...data }) => {
        return {
          body: {
            ...data,
            allowedTools: useToolSelection.getState().allowedTools,
          },
        };
      },
    }),
  });

  return (
    <div
      className="border bg-popover text-popover-foreground rounded-md origin-bottom-right data-[hidden]:opacity-0 data-[hidden]:scale-95 transition-all h-[30rem] max-h-[30rem] w-80 grid grid-rows-[auto_1fr_auto] overflow-y-hidden"
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <MessageInput
        ref={ref}
        status={status}
        onSend={(message) => {
          sendMessage({ text: message });
          posthog.capture("ai_message_sent", {
            text: message,
          });
        }}
      />
    </div>
  );
}
