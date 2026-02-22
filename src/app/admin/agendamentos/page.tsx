"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getAgendamentos, atualizarAgendamento } from "@/lib/agendamentos-store";
import { getBarbeiros } from "@/lib/barbeiros-store";

function AdminAgendamentosContent() {
  const searchParams = useSearchParams();
  const statusFromUrl = searchParams.get("status") || "";
  const [filtroStatus, setFiltroStatus] = useState<string>(statusFromUrl);
  const [agendamentos, setAgendamentos] = useState(getAgendamentos());

  useEffect(() => {
    setFiltroStatus(statusFromUrl);
  }, [statusFromUrl]);

  useEffect(() => {
    setAgendamentos(getAgendamentos());
  }, []);

  const lista = agendamentos.filter((a) => !filtroStatus || a.status === filtroStatus);

  const handleFinalizar = (id: string) => {
    atualizarAgendamento(id, { status: "finalizado" });
    setAgendamentos(getAgendamentos());
  };

  const handleCancelar = (id: string) => {
    atualizarAgendamento(id, { status: "cancelado" });
    setAgendamentos(getAgendamentos());
  };

  const barbeiros = getBarbeiros();
  const barbeiroAvatar = (barbeiroId: string) => barbeiros.find((b) => b.id === barbeiroId)?.avatar;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Agendamentos</h1>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs md:text-sm w-full sm:w-auto min-h-[44px]"
        >
          <option value="">Todos os status</option>
          <option value="confirmado">Confirmados</option>
          <option value="finalizado">Finalizados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {lista.map((a) => (
          <article
            key={a.id}
            className="bg-dark-800 rounded-xl border border-gray-700 p-3 md:p-4 flex gap-3 md:gap-4 min-w-0"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden relative shrink-0">
              <Image
                src={barbeiroAvatar(a.barbeiroId) || `https://picsum.photos/seed/barber${a.barbeiroId}/96`}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <span
                className={`inline-block px-1.5 py-0.5 rounded text-[10px] md:text-xs font-medium mb-1 md:mb-2 ${
                  a.status === "confirmado"
                    ? "bg-brand-purple text-white"
                    : a.status === "finalizado"
                    ? "bg-dark-600 text-gray-300"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {a.status === "confirmado" ? "Confirmado" : a.status === "finalizado" ? "Finalizado" : "Cancelado"}
              </span>
              <p className="text-white font-medium text-sm md:text-base truncate">{a.servicoNome}</p>
              <p className="text-gray-400 text-xs md:text-sm truncate">Com {a.barbeiroNome}</p>
              <p className="text-gray-500 text-[10px] md:text-xs mt-0.5 md:mt-1">{a.dataLabel} · {a.horario}</p>
              <p className="text-brand-purple text-xs md:text-sm font-medium mt-0.5 md:mt-1">R$ {a.preco.toFixed(2).replace(".", ",")}</p>
              <div className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
                {a.status === "confirmado" && (
                  <>
                    <button type="button" onClick={() => handleFinalizar(a.id)} className="py-1.5 px-2.5 md:px-3 rounded-lg bg-green-600 text-white text-[10px] md:text-xs hover:bg-green-700 min-h-[36px] md:min-h-[32px]">Finalizar</button>
                    <button type="button" onClick={() => handleCancelar(a.id)} className="py-1.5 px-2.5 md:px-3 rounded-lg border border-brand-red text-brand-red text-[10px] md:text-xs hover:bg-brand-red/10 min-h-[36px] md:min-h-[32px]">Cancelar</button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {lista.length === 0 && (
        <p className="text-gray-400 text-center py-8 md:py-12 text-sm md:text-base">Nenhum agendamento encontrado.</p>
      )}
    </div>
  );
}

export default function AdminAgendamentosPage() {
  return (
    <Suspense fallback={<div className="text-gray-400 py-8">Carregando...</div>}>
      <AdminAgendamentosContent />
    </Suspense>
  );
}
