"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground {...props} />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & {
    ref: React.RefObject<React.ElementRef<typeof DrawerPrimitive.Overlay>>;
  }
) => (<DrawerPrimitive.Overlay
  ref={ref}
  className={cn("fixed inset-0 bg-black/10 backdrop-blur-lg z-50", className)}
  {...props}
/>)
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    ref: React.RefObject<React.ElementRef<typeof DrawerPrimitive.Content>>;
  }
) => (<DrawerPortal>
  <DrawerOverlay />
  <DrawerPrimitive.Content
    ref={ref}
    className={cn(
      "fixed inset-x-0 bottom-0 z-50 mt-24 flex flex-col h-fit rounded-t-[10px] border bg-background left-0 right-0 max-h-[96svh] after:h-0",
      className
    )}
    {...props}
  >
    <div className="mx-auto mb-2 mt-3 h-1 w-10 rounded-full bg-black/20 dark:bg-white/20" />
    <div className="overflow-auto">{children}</div>
  </DrawerPrimitive.Content>
</DrawerPortal>)
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> & {
    ref: React.RefObject<React.ElementRef<typeof DrawerPrimitive.Title>>;
  }
) => (<DrawerPrimitive.Title
  ref={ref}
  className={cn(
    "text-lg font-semibold leading-none tracking-tight",
    className
  )}
  {...props}
/>)
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = (
  {
    ref,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> & {
    ref: React.RefObject<React.ElementRef<typeof DrawerPrimitive.Description>>;
  }
) => (<DrawerPrimitive.Description
  ref={ref}
  className={cn("text-sm text-muted-foreground", className)}
  {...props}
/>)
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
