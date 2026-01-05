"use client";

import type { ReadEvent } from "@prisma/client";
import type { User } from "lucia";
import { BarChartBig, BookIcon, HouseIcon, Menu, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModeToggle } from "../mode-toggle";
import { Skeleton } from "../ui/skeleton";
import NewspaperButton from "./bars/newspaper-button";
import { StreakButton } from "./bars/streak-button";
import UserMenu from "./bars/user-menu";

const navigationLinks = [
  { href: "/home", label: "Главная", icon: HouseIcon },
  { href: "/books", label: "Книги", icon: BookIcon },
  { href: "/journal", label: "Журнал", icon: BarChartBig },
  { href: "/groups", label: "Группы", icon: Users },
];

export default function NavBar({
  events,
  auth,
}: {
  events: Promise<ReadEvent[]>;
  auth: Promise<{ user: User; unread: number } | { user: null; unread: null }>;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => href === pathname;

  return (
    <header className="border-b px-4 md:px-6 sticky top-0 z-50 bg-background/50 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger suppressHydrationWarning asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <Menu className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          className="flex-row items-center gap-2 py-1.5"
                          render={
                            <Link href={link.href}>
                              <Icon
                                size={16}
                                className="text-muted-foreground/80"
                                aria-hidden="true"
                              />
                              <span>{link.label}</span>
                            </Link>
                          }
                          active={isActive(link.href)}
                        ></NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/home"
              className="hover:bg-accent p-1 rounded-lg transition shrink-0"
            >
              <Image
                src="/icon.png"
                alt="logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </Link>
          </div>
        </div>
        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    className="text-foreground hover:text-primary flex-row items-center gap-2 py-1.5 font-medium"
                    render={
                      <Link href={link.href}>
                        <Icon
                          size={16}
                          className="text-muted-foreground/80"
                          aria-hidden="true"
                        />
                        <span>{link.label}</span>
                      </Link>
                    }
                    active={isActive(link.href)}
                  />
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Suspense fallback={<Skeleton className="h-9 w-14 rounded-full" />}>
            <StreakButton events={events} />
          </Suspense>
          <ModeToggle />
          <NewspaperButton />
          <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
            <UserMenu auth={auth} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
