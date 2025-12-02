import { Button } from "@/components/ui/button";
import { SparklesIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MouseEventHandler } from "react";

export function AgentToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      size="icon-sm"
      variant="outline"
      className="dark:bg-neutral-800! pointer-events-auto"
      onClick={onClick}
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
