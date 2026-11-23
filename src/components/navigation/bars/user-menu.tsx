"use client";

import type { User } from "lucia";
import {
  BoltIcon,
  CircleHelpIcon,
  GalleryVertical,
  LockKeyholeIcon,
  LogOutIcon,
  MessageCircleQuestion,
  Undo2Icon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { use, useRef } from "react";
import {
  SettingsShortcut,
  useOpenSettings,
} from "@/components/settings/settings-dialog";
import CheckMark from "@/components/checkmark";
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
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { logOut } from "@/lib/actions/auth";
import { Badge } from "../../ui/badge";

export default function UserMenu({
  auth,
  admin = false,
}: {
  auth: Promise<{ user: User; unread: number } | { user: null; unread: null }>;
  admin?: boolean;
}) {
  const { user, unread } = use(auth);
  const router = useRouter();
  const pathname = usePathname();
  const openSettings = useOpenSettings();
  const menuTrigger = useRef<HTMLButtonElement>(null);

  if (!user) {
    return null;
  }

  const logOutClick = async () => {
    await logOut();
    router.replace("/");
  };

  return (
    <DropdownMenu>
      <SimpleTooltip text="Профиль">
        <DropdownMenuTrigger asChild suppressHydrationWarning>
          <Button
            ref={menuTrigger}
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
      </SimpleTooltip>
      <DropdownMenuContent className="w-max max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-foreground truncate text-sm font-medium">
              {user.firstName} {user.lastName}
            </span>
            {user.verified && <CheckMark />}
          </div>
          <span className="text-muted-foreground truncate text-xs font-normal">
            @{user.username}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.admin && (
            <Link href={admin ? "/home" : "/admin"}>
              <DropdownMenuItem>
                {admin ? (
                  <Undo2Icon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                ) : (
                  <LockKeyholeIcon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                )}

                <span>{admin ? "На сайт" : "Админ-панель"}</span>
              </DropdownMenuItem>
            </Link>
          )}
          <Link href="/faq">
            <DropdownMenuItem active={pathname === "/faq"}>
              <CircleHelpIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Частые вопросы</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/support">
            <DropdownMenuItem active={pathname === "/support"}>
              <MessageCircleQuestion
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Поддержка</span>
              {unread > 0 && <Badge className="min-w-5 px-1">{unread}</Badge>}
            </DropdownMenuItem>
          </Link>
          <Link href="/profile">
            <DropdownMenuItem active={pathname === "/profile"}>
              <UserIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Профиль</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            aria-haspopup="dialog"
            aria-keyshortcuts="Meta+Shift+, Control+Shift+,"
            onSelect={() => openSettings(menuTrigger.current)}
          >
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span className="mr-auto">Настройки</span>
            <SettingsShortcut />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/activity">
          <DropdownMenuItem active={pathname === "/activity"}>
            <GalleryVertical
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Активность</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOutClick}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
