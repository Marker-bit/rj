"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog"
import { cn, dateToString, declOfNum } from "@/lib/utils"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import useMeasure from "react-use-measure"
import { DayChart } from "./day-chart"
import { Book } from "@/lib/api-types"
import { getEventDays } from "@/lib/stats"
import { differenceInDays, endOfDay, formatDate, startOfDay } from "date-fns"
import { formatDateRange } from "little-date";
import { ru } from "date-fns/locale";

type Step = {
  title: string
  description?: string
  highlightedText?: string
  highlightedTextDescription?: string
  component?: React.ReactNode
}

export default function BookReadInfo({
  open,
  setOpen,
  book,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  book: Book
}) {
  const [isClient, setIsClient] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<-1 | 0 | 1>(0)
  const chartData = useMemo(
    () => getEventDays(book.readEvents.toReversed()),
    [book.readEvents]
  )

  const firstEvent = book.readEvents.at(-1)
  const lastEvent = book.readEvents[0]
  const readingTime =
    firstEvent && lastEvent
      ? differenceInDays(endOfDay(lastEvent.readAt), startOfDay(firstEvent.readAt)) + 1
      : 1
  const avg = chartData.reduce((a, b) => a + b.pagesRead, 0) / chartData.length

  const steps: Step[] = [
    {
      title: "Поздравляем, вы прочитали эту книгу!",
      description: "Вся информация о ней",
    },
    (firstEvent && lastEvent) ? {
      title: "Вы читали",
      highlightedText: `с ${formatDate(firstEvent.readAt, "d MMMM, yyyy", {locale: ru})} по ${formatDate(lastEvent.readAt, "d MMMM, yyyy", {locale: ru})}`,
      highlightedTextDescription: `Всего вы читали ${readingTime} ${declOfNum(
        readingTime,
        ["день", "дня", "дней"]
      )}`,
    } : undefined,
    {
      title: "В среднем, вы читали",
      highlightedText: `${avg.toFixed(1)} ${declOfNum(Math.floor(avg), [
        "страницу",
        "страницы",
        "страниц",
      ])}`,
      highlightedTextDescription: "в день",
    },
    {
      title: "Вот количество страниц, прочитанных в книге",
      description: "Показан каждый день от первого до последнего",
      component: <DayChart data={chartData} />,
    },
  ].filter(a => a !== undefined)

  const [ref, { height: stepHeight }] = useMeasure()

  const step = steps[currentStep]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const close = () => {
    setOpen(false)
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname)
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden">
        <DialogTitle className="hidden">Статистика книги</DialogTitle>
        <DialogDescription className="hidden">
          Вся информация о чтении книги
        </DialogDescription>
        <div className="flex items-center justify-center w-full gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                currentStep === i
                  ? "bg-primary w-6"
                  : "bg-primary/30 w-2 hover:bg-primary/50"
              )}
              onClick={() => setCurrentStep(i)}
            />
          ))}
        </div>
        <motion.div
          animate={{ height: stepHeight }}
          transition={{ duration: 0.5, type: "spring", bounce: 0 }}
          className="overflow-hidden"
        >
          <div ref={ref}>
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={direction}
            >
              <motion.div
                className="flex flex-col gap-2 text-center"
                key={`step-${currentStep}`}
                custom={direction}
                initial="initial"
                animate="active"
                exit="exit"
                variants={{
                  initial: (direction) => {
                    return { x: `${110 * direction}%`, opacity: 0 }
                  },
                  active: { x: "0%", opacity: 1 },
                  exit: (direction) => {
                    return { x: `${-110 * direction}%`, opacity: 0 }
                  },
                }}
                transition={{ duration: 0.5, type: "spring", bounce: 0 }}
              >
                <h1 className="text-xl font-semibold">{step.title}</h1>
                {step.description && <p>{step.description}</p>}
                {step.highlightedText && (
                  <p className="text-2xl font-bold leading-tight">
                    {step.highlightedText}
                  </p>
                )}
                {step.highlightedTextDescription && (
                  <p className="text-muted-foreground leading-tight">
                    {step.highlightedTextDescription}
                  </p>
                )}
                {step.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        <div className="flex justify-between">
          <Button
            onClick={() => {
              setCurrentStep((c) => c - 1)
              setDirection(-1)
            }}
            disabled={currentStep === 0}
          >
            <ChevronLeft />
            Назад
          </Button>
          {currentStep !== steps.length - 1 ? (
            <Button
              onClick={() => {
                setCurrentStep((c) => c + 1)
                setDirection(1)
              }}
            >
              Далее
              <ChevronRight />
            </Button>
          ) : (
            <Button onClick={() => close()}>
              Закрыть
              <XIcon />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
