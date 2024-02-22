import * as React from "react";

import { useMediaQuery } from "usehooks-ts";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Drawer as DrawerPrimitive } from "vaul";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

export function DrawerDialog({
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <>
        <Dialog {...props}>
          <DialogContent className="w-fit">{children}</DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Drawer {...props}>
        <DrawerContent>
          <div className="p-2">{children}</div>
        </DrawerContent>
      </Drawer>
    </>
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
