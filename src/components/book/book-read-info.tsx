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
import { motion } from "motion/react"
import useMeasure from "react-use-measure"
import { DayChart } from "./day-chart"
import { Book } from "@/lib/api-types"
import { getEventDays } from "@/lib/stats"
import { differenceInDays } from "date-fns"

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
  const chartData = useMemo(
    () => getEventDays(book.readEvents.toReversed()),
    [book.readEvents]
  )

  const firstEvent = book.readEvents.at(-1)
  const lastEvent = book.readEvents[0]
  const readingTime =
    firstEvent && lastEvent
      ? differenceInDays(lastEvent.readAt, firstEvent.readAt)
      : 0
  const avg = chartData.reduce((a, b) => a + b.pagesRead, 0) / chartData.length

  const steps: Step[] = [
    {
      title: "Поздравляем, вы прочитали эту книгу!",
      description: "Вся информация о ней",
    },
    {
      title: "Вы начали читать",
      highlightedText: firstEvent ? dateToString(firstEvent.readAt) : "",
    },
    {
      title: "А закончили",
      highlightedText: lastEvent ? dateToString(lastEvent.readAt) : "",
      highlightedTextDescription: `Всего вы читали ${readingTime} ${declOfNum(
        readingTime,
        ["день", "дня", "дней"]
      )}`,
    },
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
  ]

  const [ref, { height: stepHeight }] = useMeasure()

  const step = steps[currentStep]

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
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
          <div className="flex flex-col gap-2 text-center" ref={ref}>
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
          </div>
        </motion.div>
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentStep((c) => c - 1)}
            disabled={currentStep === 0}
          >
            <ChevronLeft />
            Назад
          </Button>
          {currentStep !== steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep((c) => c + 1)}
            >
              Далее
              <ChevronRight />
            </Button>
          ) : (
            <Button
              onClick={() => setOpen(false)}
            >
              Закрыть
              <XIcon />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
