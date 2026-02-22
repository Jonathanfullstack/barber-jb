"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BARBEARIA } from "@/lib/mock-data";
import { getAgendamentos } from "@/lib/agendamentos-store";

export default function AdminDashboard() {
  const [confirmados, setConfirmados] = useState(0);
  const [finalizados, setFinalizados] = useState(0);

  useEffect(() => {
    const list = getAgendamentos();
    setConfirmados(list.filter((a) => a.status === "confirmado").length);
    setFinalizados(list.filter((a) => a.status === "finalizado").length);
  }, []);

  return (
    <div>
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Dashboard — {BARBEARIA.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <Link
          href="/admin/barbearias"
          className="bg-dark-800 rounded-xl border border-gray-700 p-3 md:p-4 hover:border-brand-purple/50 transition-colors"
        >
          <p className="text-gray-400 text-xs md:text-sm">Dados da barbearia</p>
          <p className="text-lg md:text-2xl font-bold text-white mt-0.5 md:mt-1 truncate">{BARBEARIA.name}</p>
        </Link>
        <Link
          href="/admin/agendamentos?status=confirmado"
          className="bg-dark-800 rounded-xl border border-gray-700 p-3 md:p-4 hover:border-brand-purple/50 transition-colors"
        >
          <p className="text-gray-400 text-xs md:text-sm">Agendamentos confirmados</p>
          <p className="text-lg md:text-2xl font-bold text-white mt-0.5 md:mt-1">{confirmados}</p>
        </Link>
        <Link
          href="/admin/agendamentos?status=finalizado"
          className="bg-dark-800 rounded-xl border border-gray-700 p-3 md:p-4 hover:border-brand-purple/50 transition-colors"
        >
          <p className="text-gray-400 text-xs md:text-sm">Agendamentos finalizados</p>
          <p className="text-lg md:text-2xl font-bold text-white mt-0.5 md:mt-1">{finalizados}</p>
        </Link>
      </div>
      <div className="bg-dark-800 rounded-xl border border-gray-700 p-3 md:p-4">
        <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Link
            href="/admin/barbearias"
            className="px-3 py-2 rounded-lg bg-brand-purple text-white text-xs md:text-sm font-medium hover:bg-brand-purple-dark min-h-[44px] flex items-center justify-center"
          >
            Editar barbearia
          </Link>
          <Link
            href="/admin/barbeiros"
            className="px-3 py-2 rounded-lg bg-dark-700 text-white text-xs md:text-sm font-medium hover:bg-dark-600 min-h-[44px] flex items-center justify-center"
          >
            Gerenciar barbeiros
          </Link>
          <Link
            href="/admin/servicos"
            className="px-3 py-2 rounded-lg bg-dark-700 text-white text-xs md:text-sm font-medium hover:bg-dark-600 min-h-[44px] flex items-center justify-center"
          >
            Gerenciar serviços
          </Link>
          <Link
            href="/admin/agendamentos"
            className="px-3 py-2 rounded-lg bg-dark-700 text-white text-xs md:text-sm font-medium hover:bg-dark-600 min-h-[44px] flex items-center justify-center"
          >
            Ver agendamentos
          </Link>
        </div>
      </div>
    </div>
  );
}
