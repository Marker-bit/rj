"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logOut } from "@/lib/actions/auth";
import { User } from "lucia";
import {
  ChevronsUpDown,
  LockKeyhole,
  LogOut,
  Settings,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserButton({ user }: { user: User }) {
  const router = useRouter();
  const logOutClick = async () => {
    await logOut();
    router.replace("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex justify-between gap-2">
          <Image
            className="size-8 rounded-full"
            src={user.avatarUrl || "/no-avatar.png"}
            alt="avatar"
            width={32}
            height={32}
          />
          @{user.username}
          <ChevronsUpDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/profile">
          <DropdownMenuItem>
            <UserIcon /> Профиль
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/settings">
          <DropdownMenuItem>
            <Settings /> Настройки
          </DropdownMenuItem>
        </Link>
        {user.admin && (
          <Link href="/admin">
            <DropdownMenuItem>
              <LockKeyhole /> Админ-панель
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem onClick={logOutClick}>
          <LogOut /> Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
