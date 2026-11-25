"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { readBrowserStartPage } from "@/lib/start-page";
import { validateRequest } from "@/lib/validate-request";

export function LoginButton({ noRedirect }: { noRedirect: boolean }) {
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const router = useRouter();
  const [startPage, setStartPage] = useState<string>("/home");

  useEffect(() => {
    (async () => {
      const { user } = await validateRequest();
      const destination = readBrowserStartPage();
      setStartPage(destination);
      setLoggedIn(!!user);
      if (user && !noRedirect) {
        router.replace(destination);
      }
    })();
  }, [noRedirect, router]);

  return loggedIn === undefined ? (
    <Skeleton className="h-10 w-28 rounded-md" />
  ) : (
    <Button size="lg" asChild>
      <Link
        href={loggedIn ? startPage : "/auth/login"}
        className="flex items-center gap-2"
      >
        {loggedIn ? "Открыть" : "Начать"}
        <ChevronRight className="size-4" />
      </Link>
    </Button>
  );
}
