"use client";

import { Copy } from "@/components/copy";
import { useEffect, useState } from "react";

export function CopyUrl({ username }: { username: string }) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  return url ? <Copy text={`${url}/profile/${username}`} /> : <></>;
}
