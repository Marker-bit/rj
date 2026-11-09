import { SparklesIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { MouseEventHandler, Ref } from "react";
import { Button } from "@/components/ui/button";

export function AgentToggle({
  isOpen,
  onClick,
  ref,
}: {
  isOpen: boolean;
  ref?: Ref<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      ref={ref}
      size="icon-sm"
      variant="outline"
      className="pointer-events-auto max-sm:data-open:hidden rounded-full border-border bg-popover! shadow-md"
      data-open={isOpen || undefined}
      onClick={onClick}
      aria-label={isOpen ? "Закрыть ассистента" : "Открыть ассистента"}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            key="close"
          >
            <XIcon />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            key="open"
          >
            <SparklesIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
