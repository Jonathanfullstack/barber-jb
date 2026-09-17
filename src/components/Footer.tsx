"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePainelAuth } from "@/context/PainelAuthContext";

export default function Footer() {
  const { barbeiro } = usePainelAuth();
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/b/")) return null;

  return (
    <footer className="mt-auto border-t border-border py-5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} JB Barber</p>
        {barbeiro && (
          <Link href="/admin" className="flex min-h-11 items-center justify-center text-xs text-muted-foreground hover:text-primary md:inline-flex">
            Painel Admin
          </Link>
        )}
      </div>
    </footer>
  );
}
