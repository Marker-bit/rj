import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  return (
    <div className="flex flex-col gap-2 text-center items-center justify-center">
      <div className="text-[20vw] max-sm:text-[40vw] font-bold leading-none">
        404
      </div>
      <div className="text-5xl font-bold">Страница не найдена</div>
      <Button variant="ghost" asChild className="text-3xl">
        <Link href="/">Вернуться на главную</Link>
      </Button>
    </div>
  );
}
