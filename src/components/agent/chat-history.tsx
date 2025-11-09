import { Message } from "@/components/agent/message/message";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { MyUIMessage } from "@/lib/ai/message";
import { cn } from "@/lib/utils";
import {
  ChatAddToolApproveResponseFunction,
  ChatStatus,
  isToolUIPart,
} from "ai";
import { ChevronDownIcon, CircleAlertIcon, RotateCwIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const MotionMessage = motion.create(Message);

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
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const container = containerRef.current;

    const observer = new ResizeObserver((entries) => {
      handleScroll();
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
  }, [containerRef, containerRef.current?.children]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [error]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight);
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

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
          onClick={scrollToBottom}
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
          {messages.map((message, index) => (
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
              isStreaming={status === "streaming"}
            />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {(status === "submitted" ||
            (status === "streaming" &&
              messages.length > 0 &&
              messages.at(-1)!.parts.at(-1) &&
              isToolUIPart(messages.at(-1)!.parts.at(-1)!))) && (
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
