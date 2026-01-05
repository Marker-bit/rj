"use client";

import { useEffect, useState } from "react";
import { Copy } from "@/components/copy";

export function CopyUrl({ username }: { username: string }) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  return url ? (
    <Copy
      label="Ссылка на профиль"
      className="w-80"
      text={`${url}/profile/${username}`}
    />
  ) : (
    <></>
  );
}
