import Link from "next/link"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <div className="text-[20vw] font-bold leading-none max-sm:text-[40vw]">
        404
      </div>
      <div className="text-5xl font-bold">Страница не найдена</div>
      <Button variant="ghost" asChild className="text-3xl">
        <Link href="/">Вернуться на главную</Link>
      </Button>
    </div>
  )
}
