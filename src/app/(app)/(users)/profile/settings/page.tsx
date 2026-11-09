import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/require-user";
import { SettingsForm } from "./form";

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <div className="mb-20">
      <div className="m-2 flex items-center gap-2 text-3xl font-bold">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile" aria-label="Назад к профилю">
            <ChevronLeft className="size-8" />
          </Link>
        </Button>
        Настройки
      </div>
      <SettingsForm user={user} />
    </div>
  );
}
