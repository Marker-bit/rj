"use client";

import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LockKeyholeIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { validateRequest } from "@/lib/validate-request";
import { User } from "lucia";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function UserMenu() {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    async function fetchUser() {
      const { user } = await validateRequest();
      setUser(user);
    }
    fetchUser();
  }, []);

  if (!user) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent! rounded-full"
        >
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt="Ваш аватар" />
            <AvatarFallback>
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            @{user.username}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.admin && (
            <Link href="/admin">
              <DropdownMenuItem>
                <LockKeyholeIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Админ-панель</span>
              </DropdownMenuItem>
            </Link>
          )}
          <Link href="/profile">
            <DropdownMenuItem>
              <UserIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Профиль</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Настройки</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
