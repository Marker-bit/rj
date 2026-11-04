import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-4 text-center">
      <div className="text-7xl font-bold leading-none">404</div>
      <div className="text-3xl font-bold">Страница не найдена</div>
      <Button asChild className="mt-2">
        <Link href="/">Вернуться на главную</Link>
      </Button>
    </div>
  );
}
