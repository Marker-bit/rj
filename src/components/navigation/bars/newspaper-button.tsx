import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SimpleTooltip } from "@/components/ui/tooltip"
import { LightbulbIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

// Добавлять строго в конец!
const tips = [
  {
    title: "Поддержка",
    description:
      'Чтобы задать вопрос в поддержке, нажмите на свой аватар в правом верхнем углу и выберите пункт "Поддержка".',
  },
  {
    title: "Наш Telegram-канал",
    description:
      "Официальный Telegram-канал Читательского дневника - @rjrjdev. Подписывайтесь, чтобы быть в курсе новостей и обновлений.",
  },
]

export default function NewspaperButton() {
  const [open, setOpen] = useState(false)
  const [currentTip, setCurrentTip] = useLocalStorage("currentTip", 0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNavigation = () => {
    if (currentTip === tips.length - 1) {
      setOpen(false)
    }
    setCurrentTip(currentTip + 1)
  }

  if (!isClient) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <SimpleTooltip text="Советы">
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <LightbulbIcon className="size-4" />

            {currentTip !== tips.length && (
              <div
                aria-hidden="true"
                className="bg-primary absolute top-0.5 right-0.5 size-2 rounded-full"
              />
            )}
          </Button>
        </PopoverTrigger>
      </SimpleTooltip>
      <PopoverContent className="max-w-[280px] py-3 shadow-none" side="bottom">
        {currentTip === tips.length ? (
          <div className="h-20 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Советы закончились!
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[13px] font-medium">
                {tips[currentTip].title}
              </p>
              <p className="text-muted-foreground text-xs">
                {tips[currentTip].description}
              </p>
            </div>
            <button
              className="text-xs font-medium hover:underline"
              onClick={handleNavigation}
            >
              {currentTip === tips.length - 1 ? "Закрыть" : "Дальше"}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
