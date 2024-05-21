"use client"

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <Link
      href={`/${href}`}
      className={
        pathname === `/${href}`
          ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
          : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      }
      prefetch={true}
    >
      {children}
    </Link>
  )
}

export function BottomLinkMobile({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <Link href={`/${href}`} className="w-fit">
      <div
        className={cn(
          "flex flex-col text-gray-500 rounded-md p-2 items-center cursor-pointer transition-all relative",
          pathname === `/${href}` && "text-black dark:text-white"
        )}
      >
        {children}
        <AnimatePresence>
          {pathname === `/${href}` && (
            <motion.div
              layoutId="current"
              className="absolute left-0 top-0 -z-10 size-full rounded-md bg-black/5 shadow-md dark:bg-white/5"
              transition={{
                type: "tween",
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </Link>
  )
}
