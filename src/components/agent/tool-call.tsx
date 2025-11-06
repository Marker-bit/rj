import { ToolConfirmation } from "@/components/agent/tool-confirmation";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { ToolView } from "@/lib/ai/tools/types";
import { cn } from "@/lib/utils";
import {
  ChatAddToolApproveResponseFunction,
  DeepPartial,
  UITool,
  UIToolInvocation,
} from "ai";
import {
  ChevronRightIcon,
  Loader2Icon,
  LucideIcon,
  ShieldQuestionIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useState } from "react";
import z from "zod";

const iconVariants: Variants = {
  initial: { scale: 0.5, opacity: 0, filter: "blur(4px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0)" },
  exit: { scale: 0.5, opacity: 0, filter: "blur(4px)" },
};

export function ToolCall<TOOL extends UITool>({
  toolView,
  isLast = false,
  toolCall,
  addToolApprovalResponse,
}: {
  toolView: ToolView;
  isLast?: boolean;
  toolCall: UIToolInvocation<TOOL>;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const texts = toolView.texts;
  const selectedText =
    toolCall.state === "output-available"
      ? texts.successText
      : toolCall.state === "approval-requested"
        ? texts.approvalText
        : toolCall.state === "output-denied" && texts.deniedText
          ? texts.deniedText
          : texts.loadingText;

  const realIsLast = isLast && !isExpanded;

  return (
    <div
      className={cn(
        "flex gap-2 items-stretch cursor-pointer group/tool-call",
        isLast && "pb-2",
      )}
      onClick={() => setIsExpanded((a) => !a)}
    >
      <div className="flex flex-col w-6 shrink-0">
        <motion.div
          className="rounded-full border shrink-0 size-6 flex items-center justify-center origin-top relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="group-hover/tool-call:scale-50 group-hover/tool-call:opacity-0 transition-all duration-[250ms]">
            <AnimatePresence initial={false} mode="popLayout">
              {toolCall.state === "input-streaming" ||
              toolCall.state === "input-available" ? (
                <motion.div
                  key="loading"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Loader2Icon className="size-3.5 text-muted-foreground animate-spin" />
                </motion.div>
              ) : toolCall.state === "output-error" ? (
                <motion.div
                  key="error"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TriangleAlertIcon className="size-3.5 text-muted-foreground" />
                </motion.div>
              ) : toolCall.state === "output-available" ? (
                <motion.div
                  key="success"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <toolView.icon className="size-3.5 text-muted-foreground" />
                </motion.div>
              ) : toolCall.state === "approval-requested" ? (
                <motion.div
                  key="approval"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <ShieldQuestionIcon className="size-3.5 text-muted-foreground" />
                </motion.div>
              ) : (
                toolCall.state === "output-denied" && (
                  <motion.div
                    key="denied"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <XIcon className="size-3.5 text-muted-foreground" />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
          <div className="scale-0 opacity-0 group-hover/tool-call:scale-100 group-hover/tool-call:opacity-100 transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-[250ms]">
            <ChevronRightIcon
              className={cn(
                "size-4 transition-transform",
                isExpanded && "rotate-90",
              )}
            />
          </div>
        </motion.div>
        <div className="flex justify-center w-full h-[calc(100%+0.5rem)] min-h-2">
          <div
            className={cn(
              "w-px bg-border transition-all duration-200",
              realIsLast ? "opacity-0 h-0" : "opacity-100 h-full",
            )}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, filter: "blur(4px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0)" }}
            exit={{ scale: 0.9, opacity: 0, filter: "blur(4px)" }}
            className="origin-left text-sm select-none"
            transition={{ duration: 0.2 }}
            key={selectedText}
          >
            {toolCall.state === "input-streaming" ||
            toolCall.state === "input-available" ? (
              <TextShimmer duration={0.6}>{selectedText}</TextShimmer>
            ) : (
              selectedText
            )}
          </motion.div>
          {toolCall.state === "approval-requested" && (
            <ToolConfirmation
              className="mt-2"
              invocation={toolCall}
              addToolApprovalResponse={addToolApprovalResponse}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{
                scale: 0.7,
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
              exit={{ scale: 0.7, opacity: 0, filter: "blur(4px)", height: 0 }}
              className="origin-top-left text-sm whitespace-pre-wrap pt-2"
              transition={{ duration: 0.2 }}
            >
              <toolView.outputView
                input={toolCall.input as never}
                output={toolCall.output as never}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
