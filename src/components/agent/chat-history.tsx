import {
  type ChatAddToolApproveResponseFunction,
  type ChatStatus,
  isTextUIPart,
  isToolUIPart,
} from "ai";
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

export function ChatHistory({
  messages,
  error,
  status,
  onRetry,
  onRegenerate,
  addToolApprovalResponse,
  onAnswer,
}: {
  messages: MyUIMessage[];
  error?: Error;
  status: ChatStatus;
  onRetry: () => void;
  onRegenerate: (messageId: string) => void;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  onAnswer: (args: {
    toolCallId: string;
    answer: string;
    label: string;
  }) => void;
}) {
  const visibleMessages = messages.filter(hasVisibleMessageContent);
  const knownEntities = collectKnownEntities(visibleMessages);
  const lastMessage = visibleMessages.at(-1);
  const lastMessageIsAssistant = lastMessage?.role === "assistant";
  const hasPendingQuestion =
    lastMessageIsAssistant &&
    lastMessage.parts.some(
      (part) =>
        isToolUIPart(part) &&
        part.type === "tool-askUser" &&
        part.state === "input-available",
    );
  const isGeneratingText =
    lastMessageIsAssistant &&
    lastMessage.parts.some(
      (part) => isTextUIPart(part) && part.text.trim().length > 0,
    );
  const showThinking =
    status === "submitted" ||
    (status === "streaming" && !hasPendingQuestion && !isGeneratingText);
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
                  onAnswer={onAnswer}
                  isLastMessage={message.id === lastMessage?.id}
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
                  <AlertDescription>
                    Сервис ИИ временно недоступен. Проверьте подключение и
                    попробуйте снова. Если ошибка повторится, попробуйте позже.
                  </AlertDescription>
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
