import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { validateRequest } from "@/lib/server-validate-request"
import { BookOpen, Menu } from "lucide-react"
import Link from "next/link"
import UserMenu from "./user-menu"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest()

  if (!user) return null
  if (!user.admin) return null
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <BookOpen className="size-6" />
            <span className="sr-only">Читательский дневник</span>
          </Link>
          <Link
            href="/admin"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Главная
          </Link>
          <Link
            href="/admin/books"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Книги
          </Link>
          <Link
            href="/admin/support"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Поддержка
          </Link>
          <Link
            href="/admin/users"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Пользователи
          </Link>
          <Link
            href="/admin/groups"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Группы
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="size-5" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <BookOpen className="size-6" />
                <span className="sr-only">Читательский дневник</span>
              </Link>
              <Link href="/admin/" className="hover:text-foreground">
                Главная
              </Link>
              <Link
                href="/admin/books"
                className="text-muted-foreground hover:text-foreground"
              >
                Книги
              </Link>
              <Link
                href="/admin/support"
                className="text-muted-foreground hover:text-foreground"
              >
                Поддержка
              </Link>
              <Link
                href="/admin/users"
                className="text-muted-foreground hover:text-foreground"
              >
                Пользователи
              </Link>
              <Link
                href="/admin/groups"
                className="text-muted-foreground hover:text-foreground"
              >
                Группы
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <UserMenu />
        </div>
      </header>
      {children}
    </div>
  )
}
