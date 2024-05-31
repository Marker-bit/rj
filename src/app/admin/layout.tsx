import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { validateRequest } from "@/lib/server-validate-request";
import {
  Book,
  HomeIcon,
  LineChart,
  MessageCircleQuestion,
  PanelLeft,
  Users2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()

  if (!user) return null
  if (!user.admin) return null
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex size-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:size-8 md:text-base"
          >
            <Image
              src="/favicon.png"
              alt="logo"
              width={32}
              height={32}
              className="size-4 transition-all group-hover:scale-110"
            />
            <span className="sr-only">Читательский дневник</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
              >
                <HomeIcon className="size-5" />
                <span className="sr-only">Главная</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Главная</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
              >
                <Book className="size-5" />
                <span className="sr-only">Книги</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Книги</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
              >
                <Users2 className="size-5" />
                <span className="sr-only">Пользователи</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Пользователи</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
              >
                <LineChart className="size-5" />
                <span className="sr-only">Аналитика</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Аналитика</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/admin/support"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:size-8"
              >
                <MessageCircleQuestion className="size-5" />
                <span className="sr-only">Поддержка</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Поддержка</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:hidden sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="size-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex size-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Image
                    src="/favicon.png"
                    alt="logo"
                    width={32}
                    height={32}
                    className="size-4 transition-all group-hover:scale-110"
                  />
                  <span className="sr-only">Читательский дневник</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <HomeIcon className="size-5" />
                  Главная
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Book className="size-5" />
                  Книги
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="size-5" />
                  Пользователи
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="size-5" />
                  Аналитика
                </Link>
                <Link
                  href="/admin/support"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <MessageCircleQuestion className="size-5" />
                  Поддержка
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        {children}
      </div>
    </div>
  )
}
