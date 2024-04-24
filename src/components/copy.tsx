"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CopyIcon } from "lucide-react";
import { useState } from "react";

export function Copy({ text }: { text: string }) {
  const [copy, setCopy] = useState(false);
  return (
    <div className="p-2 border rounded-xl flex gap-2 items-center">
      {text}
      <div
        className="hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center p-2 rounded-xl cursor-pointer relative"
        onClick={() => {
          navigator.clipboard.writeText(text);
          if (copy) return;
          setCopy(true);
          setTimeout(() => {
            setCopy(false);
          }, 1000);
        }}
      >
        <CopyIcon className="opacity-0 w-4 h-4" />
        <AnimatePresence>
          <motion.div
            variants={{
              copy: { scale: 1, opacity: 1 },
              notCopy: { scale: 0, opacity: 0 },
            }}
            animate={copy ? "copy" : "notCopy"}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="absolute"
          >
            <Check className="text-green-500 w-4 h-4" />
          </motion.div>
          <motion.div
            variants={{
              copy: { scale: 1, opacity: 1 },
              notCopy: { scale: 0, opacity: 0 },
            }}
            animate={!copy ? "copy" : "notCopy"}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="absolute"
          >
            <CopyIcon className="w-4 h-4" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
