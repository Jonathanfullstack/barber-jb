"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function FormSheet({ triggerLabel, title, description, children }: { triggerLabel: string; title: string; description: string; children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild><Button className="w-full sm:w-auto"><Plus />{triggerLabel}</Button></SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>{description}</SheetDescription></SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
