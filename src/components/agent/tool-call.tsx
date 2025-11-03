import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";
import { Loader2Icon, LucideIcon, TriangleAlertIcon } from "lucide-react";
import { AnimatePresence, motion, Variants } from "motion/react";
import { ReactNode } from "react";

const iconVariants: Variants = {
  initial: { scale: 0.5, opacity: 0, filter: "blur(4px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0)" },
  exit: { scale: 0.5, opacity: 0, filter: "blur(4px)" },
};

export function ToolCall({
  header,
  icon: Icon,
  isLast = false,
  state = "success",
}: {
  header: ReactNode;
  icon: LucideIcon;
  isLast?: boolean;
  state?: "loading" | "success" | "error";
}) {
  return (
    <div className={cn("flex gap-2 items-center", isLast && "pb-2")}>
      <div className="flex flex-col w-6 shrink-0">
        <motion.div
          className="rounded-full border shrink-0 size-6 flex items-center justify-center origin-top"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {state === "loading" ? (
              <motion.div
                key="loading"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Loader2Icon className="size-3.5 text-muted-foreground animate-spin" />
              </motion.div>
            ) : state === "error" ? (
              <motion.div
                key="error"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TriangleAlertIcon className="size-3.5 text-muted-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="success"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Icon className="size-3.5 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="flex justify-center w-full h-full">
          <div
            className={cn(
              "w-px bg-border transition-all duration-200",
              isLast ? "opacity-0 h-0" : "h-[calc(100%+0.5rem)] min-h-2",
            )}
          />
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, filter: "blur(4px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0)" }}
          exit={{ scale: 0.9, opacity: 0, filter: "blur(4px)" }}
          className="origin-left text-sm"
          transition={{ duration: 0.2 }}
          key={state}
        >
          {state === "loading" ? (
            <TextShimmer duration={0.6}>{header}</TextShimmer>
          ) : (
            header
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
