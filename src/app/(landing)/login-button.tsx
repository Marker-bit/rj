"use client";

import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/validate-request";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginButton({ noRedirect }: { noRedirect: boolean }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { user } = await validateRequest();
      setLoggedIn(!!user);
      if (user && !noRedirect) {
        router.replace("/home");
      }
    })();
  }, []);

  return (
    <Button size="lg" asChild>
      <Link
        href={loggedIn ? "/home" : "/auth/register"}
        className="flex items-center gap-2"
      >
        {loggedIn ? "Открыть" : "Начать"}
        <ChevronRight className="size-4" />
      </Link>
    </Button>
  );
}
