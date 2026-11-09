"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

const usernameResponse = z.object({ found: z.boolean() });

export function useUsernameAvailability(currentUsername?: string) {
  const [found, setFound] = useState<boolean | null>();
  const pending = useRef<{
    controller: AbortController;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);
  const generation = useRef(0);

  const cancel = useCallback(() => {
    generation.current += 1;
    if (pending.current) {
      clearTimeout(pending.current.timer);
      pending.current.controller.abort();
      pending.current = null;
    }
  }, []);

  useEffect(() => cancel, [cancel]);

  const check = useCallback(
    (username: string) => {
      cancel();
      if (!username || username === currentUsername) {
        setFound(undefined);
        return;
      }
      setFound(null);
      const requestGeneration = generation.current;
      const controller = new AbortController();
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/auth/username?username=${encodeURIComponent(username)}`,
            { signal: controller.signal },
          );
          if (!response.ok) throw new Error("Username lookup failed");
          const data = usernameResponse.parse(await response.json());
          if (generation.current === requestGeneration) setFound(data.found);
        } catch {
          if (generation.current === requestGeneration) setFound(undefined);
        }
      }, 200);
      pending.current = { controller, timer };
    },
    [cancel, currentUsername],
  );

  return { found, check };
}
