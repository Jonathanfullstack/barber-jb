"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/cadastro") || pathname?.startsWith("/entrar") || pathname?.startsWith("/b/")) return null;
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-2 pb-[calc(.5rem+var(--safe-area-inset-bottom))] backdrop-blur md:hidden"><div className="mx-auto grid max-w-sm grid-cols-3 gap-2 text-center text-xs"><Link href="/" className="rounded-md px-2 py-2 text-foreground">Início</Link><Link href="/cadastro" className="rounded-md px-2 py-2 text-muted-foreground">Criar acesso</Link><Link href="/entrar" className="rounded-md px-2 py-2 text-primary">Painel</Link></div></nav>;
}
