"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserMenu() {
  const router = useRouter();

  const logOut = () => {
    toast.promise(
      async () => {
        await fetch("/api/auth/", {
          method: "DELETE",
        });
        router.push("/");
      },
      {
        loading: "Выход...",
        success: "Вы вышли из аккаунта",
        error: (error) => `Возникла проблема при выходе: ${error.message}`,
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="ml-auto rounded-full"
        >
          <CircleUser className="size-5" />
          <span className="sr-only">Открыть меню пользователя</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile/settings">Настройки</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/support">Поддержка</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut}>Выйти</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
