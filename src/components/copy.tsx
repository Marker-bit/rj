"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, CopyIcon } from "lucide-react"
import { useState } from "react"

export function Copy({ text }: { text: string }) {
  const [copy, setCopy] = useState(false)
  return (
    <div className="flex items-center gap-2 rounded-xl border p-2">
      {text}
      <div
        className="relative flex cursor-pointer items-center justify-center rounded-xl p-2 hover:bg-black/10 dark:hover:bg-white/10"
        onClick={() => {
          navigator.clipboard.writeText(text)
          if (copy) return
          setCopy(true)
          setTimeout(() => {
            setCopy(false)
          }, 1000)
        }}
      >
        <CopyIcon className="size-4 opacity-0" />
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
            <Check className="size-4 text-green-500" />
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
            <CopyIcon className="size-4" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
