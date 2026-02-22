"use client";

import Link from "next/link";
import { usePainelAuth } from "@/context/PainelAuthContext";

export default function Footer() {
  const { barbeiro } = usePainelAuth();

  return (
    <footer className="border-t border-gray-800 py-3 md:py-4 mt-auto md:pb-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="text-gray-500 text-xs md:text-sm">© 2023 Copyright JB Barber</p>
        {barbeiro && (
          <Link href="/admin" className="text-gray-500 text-xs md:text-sm hover:text-brand-purple min-h-[44px] flex items-center justify-center md:inline-flex">
            Painel Admin
          </Link>
        )}
      </div>
    </footer>
  );
}
