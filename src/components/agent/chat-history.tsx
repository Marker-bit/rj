import { Message } from "@/components/agent/message/message";
import { ToolCall } from "@/components/agent/tool-call";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { MyUIMessage } from "@/lib/ai/message";
import { cn } from "@/lib/utils";
import { ChatStatus } from "ai";
import {
  BrainIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  ListIcon,
  PlusIcon,
  RotateCwIcon,
  TrashIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";

const STEPS: (ComponentPropsWithoutRef<typeof ToolCall> & {
  id: string;
})[][] = [
  [
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">
          Просматривает все книги
        </div>
      ),
      icon: ListIcon,
      state: "loading",
      isLast: true,
      id: "step1",
    },
  ],
  [
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">Просмотрел все книги</div>
      ),
      icon: ListIcon,
      state: "success",
      id: "step1",
    },
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">
          Создаёт книгу{" "}
          <span className="font-bold">&quot;Моя первая книга&quot;</span>
        </div>
      ),
      icon: PlusIcon,
      isLast: true,
      state: "loading",
      id: "step2",
    },
  ],
  [
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">Просмотрел все книги</div>
      ),
      icon: ListIcon,
      state: "success",
      id: "step1",
    },
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">
          Создал книгу{" "}
          <span className="font-bold">&quot;Моя первая книга&quot;</span>
        </div>
      ),
      icon: PlusIcon,
      state: "success",
      id: "step2",
    },
    {
      header: <div className="text-sm whitespace-pre-wrap">Думает...</div>,
      icon: BrainIcon,
      isLast: true,
      id: "step3",
    },
  ],
  [
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">Просмотрел все книги</div>
      ),
      icon: ListIcon,
      state: "success",
      id: "step1",
    },
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">
          Создаёт книгу{" "}
          <span className="font-bold">&quot;Моя первая книга&quot;</span>
        </div>
      ),
      icon: PlusIcon,
      state: "success",
      id: "step2",
    },
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">
          Удаляет книгу{" "}
          <span className="font-bold">&quot;Моя первая книга&quot;</span>
        </div>
      ),
      icon: TrashIcon,
      state: "loading",
      isLast: true,
      id: "step4",
    },
  ],
  [
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">Просмотрел все книги</div>
      ),
      icon: ListIcon,
      state: "success",
      id: "step1",
    },
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">
          Создал книгу{" "}
          <span className="font-bold">&quot;Моя первая книга&quot;</span>
        </div>
      ),
      icon: PlusIcon,
      state: "success",
      id: "step2",
    },
    {
      header: (
        <div className="text-sm whitespace-pre-wrap">
          Удалил книгу{" "}
          <span className="font-bold">&quot;Моя первая книга&quot;</span>
        </div>
      ),
      icon: TrashIcon,
      state: "success",
      isLast: true,
      id: "step4",
    },
  ],
];

const MotionMessage = motion.create(Message);

export function ChatHistory({
  messages,
  error,
  status,
  onRetry,
  onRegenerate,
}: {
  messages: MyUIMessage[];
  error?: Error;
  status: ChatStatus;
  onRetry: () => void;
  onRegenerate: (messageId: string) => void;
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const currentStep = STEPS[currentStepIdx];

  useEffect(() => {
    const container = containerRef.current;

    const observer = new ResizeObserver((entries) => {
      console.log(entries);
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
    const interval = setInterval(() => {
      setCurrentStepIdx((prevStepIdx) => (prevStepIdx + 1) % STEPS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentStep]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  }, [messages]);

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
    <div className="h-full relative flex flex-col min-h-0">
      <div
        className={cn(
          "absolute bottom-0 left-0 p-2 flex items-center justify-center pointer-events-none z-10 w-full bg-gradient-to-t from-background/50 to-background/0 transition-opacity",
          isAtBottom ? "opacity-0" : "opacity-100",
        )}
      >
        <Button
          className={cn(
            isAtBottom
              ? "pointer-events-none scale-90"
              : "pointer-events-auto scale-100",
            "dark:bg-neutral-800! rounded-full transition-transform origin-bottom",
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
              exit={{ scale: 0.6, opacity: 0, filter: "blur(4px)", height: 0 }}
              key={message.id}
              message={message}
              onRegenerate={() => onRegenerate(message.id)}
            />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {status === "submitted" && (
            <motion.div
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
              exit={{ scale: 0.6, opacity: 0, filter: "blur(4px)", height: 0 }}
              className="pb-2 overflow-visible"
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
              className="text-red-500 bg-red-100/20 dark:bg-red-900/20 p-2 rounded-md flex flex-col gap-2 origin-top"
              initial={{ opacity: 0, scaleY: 0.6, scaleX: 0.9 }}
              animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleY: 0.6, scaleX: 0.9 }}
            >
              <div className="flex gap-2 text-sm">
                <CircleAlertIcon className="size-[1lh] shrink-0 pt-1" />
                {error.message}
              </div>
              <Button onClick={() => onRetry()} variant="outline">
                <RotateCwIcon /> Попробовать снова
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        {/*<AnimatePresence>
        {currentStep.map(({ id, ...step }, index) => (
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, filter: "blur(4px)", height: 0 }}
            key={id}
            className="origin-top-left"
          >
            <ToolCall {...step} />
          </motion.div>
        ))}
      </AnimatePresence>*/}
        {/*<div className="text-sm">
        Привет! Я искусственный интеллект от разработчиков RJ.
      </div>*/}
        {/*<Button
        className="self-end mt-auto"
        onClick={() =>
          setCurrentStepIdx((prevStepIdx) => (prevStepIdx + 1) % STEPS.length)
        }
      >
        Далее
      </Button>*/}
      </div>
    </div>
  );
}
