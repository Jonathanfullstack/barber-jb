"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { usePainelAuth } from "@/context/PainelAuthContext";

export default function Header() {
  const pathname = usePathname();
  const { barbeiro } = usePainelAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAgendamentos = pathname === "/agendamentos";
  const isPerfil = pathname === "/perfil";

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 safe-area-top" style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}>
      <div className="max-w-7xl mx-auto px-4 h-14 min-h-[44px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 min-h-[44px] items-center">
          <span className="text-lg sm:text-xl font-bold text-white">
            JB <span className="text-brand-purple">BARBER</span>
          </span>
        </Link>

        {/* Desktop: nav completo (Agendamentos só para funcionário logado) */}
        <nav className="hidden md:flex items-center gap-4 shrink-0">
          {barbeiro && (
            <Link
              href="/agendamentos"
              className={`flex items-center gap-2 text-sm min-h-[44px] items-center px-2 ${isAgendamentos ? "text-brand-purple font-medium" : "text-gray-400 hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Meus Agendamentos
            </Link>
          )}
          <Link
            href="/painel"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white min-h-[44px] items-center px-2"
            title="Área do funcionário"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Painel
          </Link>
          <Link
            href="/perfil"
            className={`flex items-center gap-2 rounded-full pl-1 pr-3 py-1.5 min-h-[44px] ${isPerfil ? "bg-brand-purple text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600"}`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden relative">
              <Image src="https://picsum.photos/seed/perfil-user/100/100" alt="Perfil" fill className="object-cover" unoptimized />
            </div>
            <span className="text-sm font-medium">Perfil</span>
          </Link>
        </nav>

        {/* Mobile: menu hamburger (Admin + links extras) */}
        <div className="md:hidden flex items-center gap-1">
          <Link
            href="/admin"
            className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Admin"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-xl">
          <div className="px-4 py-3 flex flex-col gap-1">
            {barbeiro && (
              <Link href="/agendamentos" className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-300 hover:bg-dark-700 min-h-[48px]" onClick={() => setMenuOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Meus Agendamentos
              </Link>
            )}
            <Link href="/painel" className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-300 hover:bg-dark-700 min-h-[48px]" onClick={() => setMenuOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Painel
            </Link>
            <Link href="/perfil" className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-300 hover:bg-dark-700 min-h-[48px]" onClick={() => setMenuOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Perfil
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
