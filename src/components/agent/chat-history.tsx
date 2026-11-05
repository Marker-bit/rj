import { type ChatAddToolApproveResponseFunction, type ChatStatus } from "ai";
import {
  ArrowDownIcon,
  CircleAlertIcon,
  LoaderCircleIcon,
  RotateCwIcon,
} from "lucide-react";
import { Message } from "@/components/agent/message/message";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace";
import type { MyUIMessage } from "@/lib/ai/message";
import {
  collectKnownEntities,
  hasVisibleMessageContent,
} from "@/lib/ai/message";

function getErrorMessage(error: Error) {
  if (/api key expired|invalid api key|unauthorized|401/i.test(error.message)) {
    return "Сервис ИИ временно недоступен. Попробуйте позже.";
  }

  return error.message;
}

export function ChatHistory({
  messages,
  error,
  status,
  onRetry,
  onRegenerate,
  addToolApprovalResponse,
}: {
  messages: MyUIMessage[];
  error?: Error;
  status: ChatStatus;
  onRetry: () => void;
  onRegenerate: (messageId: string) => void;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
}) {
  const visibleMessages = messages.filter(hasVisibleMessageContent);
  const knownEntities = collectKnownEntities(visibleMessages);
  const lastMessage = visibleMessages.at(-1);
  const showThinking =
    status === "submitted" ||
    (status === "streaming" && lastMessage?.role !== "assistant");
  const streamingMessageId =
    status === "streaming" ? lastMessage?.id : undefined;

  return (
    <MessageScrollerProvider autoScroll>
      <MessageScroller>
        <MessageScrollerViewport aria-label="Сообщения">
          <MessageScrollerContent
            aria-busy={showThinking}
            className="gap-6 px-2 pt-3 pb-8"
          >
            {visibleMessages.map((message) => (
              <MessageScrollerItem
                key={message.id}
                messageId={message.id}
                scrollAnchor={message.role === "user"}
              >
                <Message
                  message={message}
                  knownEntities={knownEntities}
                  onRegenerate={() => onRegenerate(message.id)}
                  addToolApprovalResponse={addToolApprovalResponse}
                  isStreaming={
                    message.role === "assistant" &&
                    message.id === streamingMessageId
                  }
                  canRegenerate={
                    status !== "submitted" && status !== "streaming"
                  }
                />
              </MessageScrollerItem>
            ))}
            {showThinking && (
              <MessageScrollerItem>
                <Trace>
                  <TraceLine status="running">
                    <TraceIcon>
                      <LoaderCircleIcon className="animate-spin" />
                    </TraceIcon>
                    <TraceTitle>Думает…</TraceTitle>
                  </TraceLine>
                </Trace>
              </MessageScrollerItem>
            )}
            {error && (
              <MessageScrollerItem>
                <Alert variant="destructive">
                  <CircleAlertIcon />
                  <AlertTitle>Не удалось получить ответ</AlertTitle>
                  <AlertDescription>{getErrorMessage(error)}</AlertDescription>
                  <Button
                    onClick={() => onRetry()}
                    variant="outline"
                    className="col-span-2 mt-3 w-full"
                  >
                    <RotateCwIcon /> Попробовать снова
                  </Button>
                </Alert>
              </MessageScrollerItem>
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton>
          <ArrowDownIcon />
          <span className="sr-only">Прокрутить вниз</span>
        </MessageScrollerButton>
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
