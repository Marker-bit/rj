"use client";

import {
  BoltIcon,
  LockKeyholeIcon,
  LogOutIcon,
  MessageCircleQuestion,
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
import { Session, User } from "lucia";
import Link from "next/link";
import { use } from "react";
import { Badge } from "../ui/badge";

export default function UserMenu({
  auth,
}: {
  auth: Promise<{ user: User; unread: number } | { user: null; unread: null }>;
}) {
  const { user, unread } = use(auth);

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent! rounded-full relative"
        >
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt="Ваш аватар" />
            <AvatarFallback>
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          {unread > 0 && (
            <div
              aria-hidden="true"
              className="bg-primary absolute top-0 right-0 size-2 rounded-full"
            />
          )}
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
          <Link href="/support">
            <DropdownMenuItem>
              <MessageCircleQuestion
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Поддержка</span>
              {unread > 0 && (
                <Badge className="min-w-5 px-1">{unread}</Badge>
              )}
            </DropdownMenuItem>
          </Link>
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
