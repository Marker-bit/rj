"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen } from "lucide-react"

export function Landing({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="h-screen w-full overflow-hidden rounded-xl p-2"
        style={{
          background:
            "repeating-linear-gradient(to right, hsl(var(--border)), transparent 1px, transparent 10px), repeating-linear-gradient(to bottom, hsl(var(--border)), transparent 1px, transparent 10px)",
        }}
      >
        <div
          className="flex size-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl p-2"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse at top, transparent 60%, hsl(var(--primary) / 0.2))",
              "linear-gradient(to bottom, transparent 30%, hsl(var(--primary) / 0.2))",
              "linear-gradient(to bottom, hsl(var(--background)) 40%, transparent)",
              "repeating-linear-gradient(45deg, transparent,transparent 60px, hsl(var(--primary)) 61px, transparent 62px)",
            ].join(", "),
          }}
        >
          <div className="rounded-xl bg-gradient-to-b from-zinc-200 to-zinc-300 p-2 dark:from-zinc-800 dark:to-zinc-700">
            <Image
              src="/favicon.png"
              width={100}
              height={100}
              alt="logo"
              className="size-14"
              loading="eager"
            />
          </div>
          <motion.h1
            className="text-center text-5xl font-black md:text-7xl"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Читательский дневник
          </motion.h1>
          <motion.p
            className="text-center text-xl"
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Читайте, пишите и делитесь своими любимыми книгами
          </motion.p>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {loggedIn ? (
              <Link href="/home">
                <Button>Открыть</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button>Начать</Button>
              </Link>
            )}
          </motion.div>
          <motion.div
            className="mb-[-150px] mt-16 size-[300px] rounded-full bg-background md:mb-[-250px] md:size-[500px]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 0%, transparent 40%, hsl(var(--primary)))",
            }}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        </div>
      </motion.div>
      <div className="w-full">
        <motion.div className="m-2 grid min-h-screen w-fit grid-cols-2 items-center justify-center gap-2 p-2 max-sm:grid-cols-1">
          <motion.div
            initial={{ scale: 0.5, filter: "blur(10px)" }}
            whileInView={{ scale: 1, filter: "blur(0px)" }}
            className="flex gap-2 rounded-xl border p-4 md:max-w-[40%]"
          >
            <div className="size-fit rounded-full border p-2 text-muted-foreground/70">
              <BookOpen className="size-6" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-muted-foreground">
              <div className="font-bold">
                Поможет не забыть прочитанные книги
              </div>
              <p>
                Вы всегда можете проверить, читали ли вы какую-то книгу через
                поиск.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, filter: "blur(10px)" }}
            whileInView={{ scale: 1, filter: "blur(0px)" }}
            className="flex gap-2 rounded-xl border p-4 md:max-w-[40%]"
          >
            <div
              className="size-fit rounded-full border p-2 text-muted-foreground/70"
            >
              <BookOpen className="size-6" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col text-muted-foreground">
              <div className="font-bold">
                Поможет не забыть прочитанные книги
              </div>
              <p>
                Вы всегда можете проверить, читали ли вы какую-то книгу через
                поиск.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
