"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({ className, side = "right", children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: "top" | "right" | "bottom" | "left" }) {
  const positions = {
    top: "inset-x-0 top-0 border-b",
    right: "inset-y-0 right-0 h-full w-[86%] max-w-sm border-l",
    bottom: "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-xl border-t",
    left: "inset-y-0 left-0 h-full w-[86%] max-w-sm border-r",
  };
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogPrimitive.Content className={cn("fixed z-50 overflow-y-auto border-border bg-popover p-5 text-popover-foreground shadow-2xl outline-none", positions[side], className)} {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="size-5" />
          <span className="sr-only">Fechar</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-5 space-y-1 pr-10", className)} {...props} />;
}
export const SheetTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />);
SheetTitle.displayName = "SheetTitle";
export const SheetDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />);
SheetDescription.displayName = "SheetDescription";
