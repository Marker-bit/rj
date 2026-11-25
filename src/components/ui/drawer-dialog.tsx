import type * as React from "react";

import { useMediaQuery } from "usehooks-ts";
import type { Drawer as DrawerPrimitive } from "vaul";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

function fitDrawerToViewport(drawer: HTMLDivElement | null) {
  const viewport = window.visualViewport;
  const body = drawer?.querySelector<HTMLElement>('[data-slot="drawer-body"]');
  if (!drawer || !viewport || !body) return;

  const update = () => {
    if (viewport.height <= 0) return;

    const layoutHeight = document.documentElement.clientHeight;
    const isInset = viewport.scale === 1 && viewport.height < layoutHeight;
    const bottom = Math.max(
      0,
      layoutHeight - viewport.height - viewport.offsetTop,
    );

    drawer.style.bottom = isInset ? `${bottom}px` : "";
    drawer.style.maxHeight = isInset ? `min(80dvh, ${viewport.height}px)` : "";

    const focused = document.activeElement;
    if (!focused || !body.contains(focused)) return;

    const field = focused.getBoundingClientRect();
    const visible = body.getBoundingClientRect();
    if (field.bottom > visible.bottom) {
      body.scrollTop += field.bottom - visible.bottom;
    } else if (field.top < visible.top) {
      body.scrollTop -= visible.top - field.top;
    }
  };

  update();
  viewport.addEventListener("resize", update);
  viewport.addEventListener("scroll", update);
  body.addEventListener("focusin", update);
  return () => {
    viewport.removeEventListener("resize", update);
    viewport.removeEventListener("scroll", update);
    body.removeEventListener("focusin", update);
    drawer.style.bottom = "";
    drawer.style.maxHeight = "";
  };
}

export function DrawerDialog({
  children,
  className,
  title: _title,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  className?: string;
  title?: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent
          className={cn("w-fit max-h-screen overflow-auto", className)}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  // Vaul writes a fixed height and skips restoring it on mobile Firefox.
  const fitViewport =
    (props.direction ?? "bottom") === "bottom" &&
    !props.snapPoints?.length &&
    !props.container &&
    props.repositionInputs !== false;

  return (
    <Drawer
      {...props}
      repositionInputs={fitViewport ? false : props.repositionInputs}
    >
      <DrawerContent ref={fitViewport ? fitDrawerToViewport : undefined}>
        <div
          data-slot="drawer-body"
          className="min-h-0 overflow-y-auto overscroll-y-contain p-4 pt-0"
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function DrawerAlertDialog({
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        <AlertDialogContent>{children}</AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <div className="p-2">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
