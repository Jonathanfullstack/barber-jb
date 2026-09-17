"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/b/")) return null;
  return <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-[0.12em]"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs tracking-normal text-primary-foreground">JB</span> BARBER</Link>
      <nav className="flex items-center gap-1">
        <ThemeToggle />
        <Button asChild variant="ghost" size="sm"><Link href="/entrar">Entrar</Link></Button>
        <Button asChild size="sm" className="hidden sm:inline-flex"><Link href="/cadastro">Criar acesso</Link></Button>
      </nav>
    </div>
  </header>;
}
