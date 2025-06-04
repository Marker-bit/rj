"use client";

import { cn, declOfNum } from "@/lib/utils";
import { Book, ReadEvent, User } from "@prisma/client";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import Event from "./event";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function EventRepeat({
  events,
}: {
  events: (ReadEvent & { book: Book & { user: User } })[];
}) {
  const fromPage = events[events.length - 1].pagesRead;
  const toPage = events[0].pagesRead;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Event event={events[0]} />
      <div className="flex items-center gap-2 rounded-xl border p-2">
        <button
          className={cn(
            "flex size-12 p-2 items-center justify-center rounded-full border text-zinc-400 dark:text-zinc-600",
          )}
          onClick={() => setOpen(!open)}
        >
          <ChevronDown
            className={cn(
              "size-5 transition duration-300",
              open && "rotate-180",
            )}
          />
        </button>
        <div className="flex flex-col">
          <div className="font-bold">
            {events.length - 1}{" "}
            {declOfNum(events.length - 1, ["событие", "события", "событий"])} в
            книге &quot;{events[0].book.title.trim()}&quot;
          </div>
          <div className="text-sm text-muted-foreground">
            с {fromPage} страницы
          </div>
          <div className="text-sm text-muted-foreground">
            по {toPage} страницу
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="flex flex-col gap-2 rounded-xl border p-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {events.slice(1).map((event) => (
              <Event key={event.id} event={event} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
