"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/barbearias", label: "Barbearia" },
  { href: "/admin/barbeiros", label: "Barbeiros" },
  { href: "/admin/servicos", label: "Serviços" },
  { href: "/admin/agendamentos", label: "Agendamentos" },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const isActive = (path: string) => pathname === path || (path !== "/admin" && pathname?.startsWith(path));

  const SidebarContent = () => (
    <>
      <div className="p-3 md:p-4 border-b border-gray-700">
        <Link href="/" className="text-base md:text-lg font-bold text-white" onClick={() => setMenuAberto(false)}>
          JB <span className="text-brand-purple">BARBER</span>
        </Link>
        <p className="text-gray-500 text-[10px] md:text-xs mt-0.5 md:mt-1">Painel Admin (equipe)</p>
      </div>
      <nav className="p-2 flex-1">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMenuAberto(false)}
            className={`block px-3 md:px-4 py-2.5 md:py-3 rounded-lg mb-0.5 md:mb-1 text-sm md:text-base ${
              (href === "/admin" ? pathname === "/admin" : isActive(href))
                ? "bg-brand-purple/20 text-brand-purple font-medium"
                : "text-gray-300 hover:bg-dark-700 hover:text-white"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-3 md:p-4 border-t border-gray-700">
        <Link href="/" className="text-xs md:text-sm text-gray-500 hover:text-gray-400" onClick={() => setMenuAberto(false)}>
          ← Voltar ao site
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      {/* Overlay mobile */}
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMenuAberto(false)}
        />
      )}
      {/* Sidebar: drawer no mobile, fixo no desktop */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-50 w-52 md:w-56
          bg-dark-800 border-r border-gray-700 flex flex-col
          transform transition-transform duration-200 ease-out
          md:transform-none md:shrink-0
          ${menuAberto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarContent />
      </aside>
      {/* Conteúdo + botão menu mobile */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700"
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-bold text-white truncate">JB <span className="text-brand-purple">BARBER</span></span>
          <span className="w-10" />
        </header>
        <main className="flex-1 overflow-auto min-w-0 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminGuard>
  );
}
