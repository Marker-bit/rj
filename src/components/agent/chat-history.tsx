import {
  type ChatAddToolApproveResponseFunction,
  type ChatStatus,
  isToolUIPart,
} from "ai";
import { ChevronDownIcon, CircleAlertIcon, RotateCwIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "@/components/agent/message/message";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import type { MyUIMessage } from "@/lib/ai/message";
import { cn } from "@/lib/utils";

const MotionMessage = motion.create(Message);
const BOTTOM_THRESHOLD_PX = 24;

const hasVisibleText = (message?: MyUIMessage) =>
  message?.parts.some(
    (part) => part.type === "text" && part.text.trim().length > 0,
  ) ?? false;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const lastMessage = messages.at(-1);
  const lastPart = lastMessage?.parts.at(-1);
  const lastPartIsTool = lastPart ? isToolUIPart(lastPart) : false;
  const showThinking =
    status === "submitted" ||
    (status === "streaming" &&
      (!lastMessage ||
        lastMessage.role === "user" ||
        (lastMessage.role === "assistant" &&
          (!hasVisibleText(lastMessage) || lastPartIsTool))));

  const updateIsAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return true;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const nextIsAtBottom = distanceFromBottom <= BOTTOM_THRESHOLD_PX;

    isAtBottomRef.current = nextIsAtBottom;
    setIsAtBottom(nextIsAtBottom);

    return nextIsAtBottom;
  }, []);

  const handleScroll = useCallback(() => {
    updateIsAtBottom();
  }, [updateIsAtBottom]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
    isAtBottomRef.current = true;
    setIsAtBottom(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    const observer = new ResizeObserver((_entries) => {
      if (isAtBottomRef.current) {
        scrollToBottom("auto");
        return;
      }

      updateIsAtBottom();
    });
    const mutObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" && container) {
          for (const child of container.children) {
            observer.observe(child);
          }
        }
      }
    });

    if (container) {
      mutObserver.observe(container, { childList: true });
      for (const child of container.children) {
        observer.observe(child);
      }
    }

    return () => {
      if (container) {
        mutObserver.disconnect();
        for (const child of container.children) {
          observer.unobserve(child);
        }
      }
    };
  }, [scrollToBottom, updateIsAtBottom]);

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom("auto");
    }
  }, [messages, status, scrollToBottom]);

  return (
    <>
      <div
        className={cn(
          "absolute bottom-0 left-0 flex items-end justify-center pointer-events-none z-10 w-full transition-opacity h-20",
          isAtBottom ? "opacity-0" : "opacity-100",
        )}
      >
        <div
          className="absolute size-full backdrop-blur-lg bg-background/70"
          style={{
            maskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
          }}
        ></div>
        <Button
          className={cn(
            isAtBottom
              ? "pointer-events-none scale-90"
              : "pointer-events-auto scale-100",
            "dark:bg-neutral-800! rounded-full transition-transform origin-bottom mb-2",
          )}
          size="sm"
          variant="outline"
          onClick={() => scrollToBottom("smooth")}
        >
          <ChevronDownIcon />
          Прокрутить вниз
        </Button>
      </div>
      <div
        className="overflow-auto flex flex-col p-2 grow max-h-full min-h-0"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {messages.map((message, _index) => (
            <MotionMessage
              initial={{
                scale: 0.6,
                opacity: 0,
                filter: "blur(4px)",
                height: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0)",
                height: "auto",
              }}
              exit={{
                scale: 0.6,
                opacity: 0,
                filter: "blur(4px)",
                height: 0,
              }}
              key={message.id}
              message={message}
              onRegenerate={() => onRegenerate(message.id)}
              addToolApprovalResponse={addToolApprovalResponse}
              isStreaming={
                status === "streaming" &&
                message.role === "assistant" &&
                message.id === lastMessage?.id
              }
              canRegenerate={status !== "submitted" && status !== "streaming"}
            />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {showThinking && (
            <motion.div
              initial={{
                scale: 0.6,
                opacity: 0,
                filter: "blur(4px)",
                height: 0,
                paddingBottom: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0)",
                height: "auto",
                paddingBottom: "0.5rem",
              }}
              exit={{
                scale: 0.6,
                opacity: 0,
                filter: "blur(4px)",
                height: 0,
                paddingBottom: 0,
              }}
              className="overflow-visible w-fit"
            >
              <TextShimmer className="font-mono text-sm w-fit" duration={0.5}>
                Думает...
              </TextShimmer>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {error && (
            <motion.div
              className="overflow-hidden flex-none"
              initial={{ opacity: 0, scaleX: 0.9, height: 0 }}
              animate={{
                opacity: 1,
                scaleX: 1,
                height: "auto",
              }}
              exit={{ opacity: 0, scaleX: 0.9, height: 0 }}
              style={{ display: "grid" }}
            >
              <div className="bg-red-100/20 dark:bg-red-900/20 px-2 rounded-md flex flex-col gap-2 origin-top">
                <div className="flex gap-2 text-sm mt-2 text-red-500">
                  <CircleAlertIcon className="size-[1lh] shrink-0 pt-1" />
                  {error.message}
                </div>
                <Button
                  onClick={() => onRetry()}
                  variant="outline"
                  className="mb-2 hover:bg-red-500/30!"
                >
                  <RotateCwIcon /> Попробовать снова
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
