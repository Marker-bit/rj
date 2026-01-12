import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/server-validate-request";
import { SettingsForm } from "./form";

export default async function SettingsPage() {
  const { user } = await validateRequest();
  if (!user) return null;
  return (
    <div className="mb-20">
      <div className="m-2 flex items-center gap-2 text-5xl font-black">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile">
            <ChevronLeft className="size-8" />
          </Link>
        </Button>
        Настройки
      </div>
      <SettingsForm user={user} />
    </div>
  );
}
