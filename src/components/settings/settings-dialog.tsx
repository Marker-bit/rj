"use client";

import type { User } from "lucia";
import { ArrowBigUp } from "lucide-react";
import {
  Suspense,
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SettingsForm } from "./settings-form";

type OpenSettings = (trigger?: HTMLElement | null) => void;
const SettingsContext = createContext<OpenSettings | null>(null);

export function useOpenSettings() {
  const openSettings = useContext(SettingsContext);
  if (!openSettings) throw new Error("SettingsProvider is missing");
  return openSettings;
}

export function SettingsShortcut() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac/.test(navigator.platform));
  }, []);

  return (
    <KbdGroup
      aria-label={isMac ? "Command+Shift+Comma" : "Control+Shift+Comma"}
    >
      <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
      <Kbd>
        <ArrowBigUp className="size-3" aria-hidden="true" />
      </Kbd>
      <Kbd>,</Kbd>
    </KbdGroup>
  );
}

export function SettingsProvider({
  user,
  children,
}: {
  user: Promise<User | null>;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const openSettings: OpenSettings = useCallback((trigger) => {
    opener.current =
      trigger ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);
    setOpen(true);
  }, []);

  return (
    <SettingsContext.Provider value={openSettings}>
      {children}
      <Suspense>
        <SettingsDialog
          user={user}
          open={open}
          onOpenChange={setOpen}
          restoreFocus={() => opener.current?.focus()}
        />
      </Suspense>
    </SettingsContext.Provider>
  );
}

function SettingsDialog({
  user,
  open,
  onOpenChange,
  restoreFocus,
}: {
  user: Promise<User | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restoreFocus: () => void;
}) {
  const currentUser = use(user);
  const openSettings = useOpenSettings();

  useEffect(() => {
    if (!currentUser || open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        !event.shiftKey ||
        event.metaKey === event.ctrlKey ||
        event.code !== "Comma"
      ) {
        return;
      }
      if (
        document.querySelector(
          '[role="dialog"][aria-modal="true"], [data-slot="dialog-content"][data-state="open"], [role="alertdialog"]',
        )
      )
        return;

      event.preventDefault();
      openSettings();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentUser, open, openSettings]);

  if (!currentUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="h-[min(38rem,calc(100dvh-2rem))] grid-rows-[minmax(0,1fr)] overflow-hidden p-0 sm:max-w-[min(48rem,calc(100%-2rem))]"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          restoreFocus();
        }}
      >
        <SettingsForm user={currentUser} />
      </DialogContent>
    </Dialog>
  );
}
