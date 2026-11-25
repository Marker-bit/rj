"use client";

import { Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function copyOnInsecureOrigin(url: string) {
  const previousFocus = document.activeElement;
  const field = document.createElement("textarea");
  field.value = url;
  field.readOnly = true;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);

  try {
    field.select();
    field.setSelectionRange(0, url.length);
    return document.execCommand("copy");
  } finally {
    field.remove();
    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus({ preventScroll: true });
    }
  }
}

export function ShareProfileButton({ username }: { username: string }) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  function profileUrl() {
    return new URL(
      `/profile/${encodeURIComponent(username)}`,
      window.location.origin,
    ).href;
  }

  async function share() {
    try {
      await navigator.share({ url: profileUrl() });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Не удалось поделиться ссылкой");
    }
  }

  async function copy() {
    const url = profileUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else if (!copyOnInsecureOrigin(url)) {
        throw new Error("Clipboard unavailable");
      }
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={share}
        disabled={!canShare}
      >
        <Share2 />
        Поделиться
      </Button>
      <Button type="button" variant="outline" onClick={copy}>
        <Copy />
        Скопировать ссылку
      </Button>
    </div>
  );
}
