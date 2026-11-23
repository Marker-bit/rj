"use client";

import { Settings } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useOpenSettings } from "./settings-dialog";

export function SettingsButton() {
  const openSettings = useOpenSettings();

  useEffect(() => {
    if (window.location.hash !== "#settings") return;

    const url = new URL(window.location.href);
    url.hash = "";
    window.history.replaceState(null, "", url);
    openSettings();
  }, [openSettings]);

  return (
    <Button
      variant="secondary"
      size="icon"
      className="size-8"
      aria-label="Настройки профиля"
      aria-haspopup="dialog"
      onClick={(event) => openSettings(event.currentTarget)}
    >
      <Settings />
    </Button>
  );
}
