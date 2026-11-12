"use client";

import type { User } from "lucia";
import {
  BookHeartIcon,
  BookIcon,
  HouseIcon,
  Menu,
  MessageCircleQuestion,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { Skeleton } from "../ui/skeleton";
import UserMenu from "./bars/user-menu";
import {
  type BuildInfo,
  LogoWithBuildTooltip,
  MobileBuildFooter,
} from "./build-badge";

const navigationLinks = [
  { href: "/admin", label: "Главная", icon: HouseIcon },
  { href: "/admin/books", label: "Книги", icon: BookIcon },
  { href: "/admin/support", label: "Поддержка", icon: MessageCircleQuestion },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  {
    href: "/admin/recommendations",
    label: "Рекомендации",
    icon: BookHeartIcon,
  },
];

export default function AdminNavBar({
  auth,
  build,
}: {
  auth: Promise<{ user: User; unread: number } | { user: null; unread: null }>;
  build: BuildInfo;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => href === pathname;

  return (
    <header className="border-b px-4 md:px-6 sticky top-0 z-50 bg-background">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <Menu className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-1 md:hidden">
              <nav className="flex flex-col gap-0.5">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive(link.href) &&
                          "bg-accent font-medium text-accent-foreground",
                      )}
                    >
                      <Icon
                        size={16}
                        className="text-muted-foreground/80"
                        aria-hidden="true"
                      />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <MobileBuildFooter build={build} />
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center">
            <LogoWithBuildTooltip
              build={build}
              className="hover:bg-muted-foreground/10"
            />
          </div>
        </div>
        {/* Middle area */}
        <nav className="flex items-center gap-2 max-md:hidden">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 font-medium text-foreground transition-colors hover:text-primary",
                  isActive(link.href) && "text-primary",
                )}
              >
                <Icon
                  size={16}
                  className="text-muted-foreground/80"
                  aria-hidden="true"
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <ModeToggle />
          <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
            <UserMenu admin auth={auth} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
