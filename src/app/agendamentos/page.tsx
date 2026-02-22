"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ModalCancelarReserva from "@/components/ModalCancelarReserva";
import { usePainelAuth } from "@/context/PainelAuthContext";
import { BARBEARIA, AGENDAMENTOS } from "@/lib/mock-data";
import { getAgendamentos, atualizarAgendamento, type AgendamentoItem } from "@/lib/agendamentos-store";

export default function AgendamentosPage() {
  const router = useRouter();
  const { barbeiro } = usePainelAuth();
  const [mounted, setMounted] = useState(false);
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>(AGENDAMENTOS as AgendamentoItem[]);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);

  useEffect(() => {
    setAgendamentos(getAgendamentos());
    setMounted(true);
  }, []);

  // Área só para funcionários: cliente que acessar a URL é redirecionado para a home
  useEffect(() => {
    if (mounted && !barbeiro) router.replace("/");
  }, [mounted, barbeiro, router]);

  // Só aplica filtro por barbeiro após hidratação (evita mismatch server/client)
  const lista = mounted && barbeiro
    ? agendamentos.filter((a) => a.barbeiroId === barbeiro.id)
    : agendamentos;

  const confirmados = lista.filter((a) => a.status === "confirmado");
  const finalizados = lista.filter((a) => a.status === "finalizado");
  const selecionado = lista.find((a) => a.status === "confirmado");

  const handleConfirmarCancelamento = () => {
    if (!cancelandoId) return;
    atualizarAgendamento(cancelandoId, { status: "cancelado" });
    setAgendamentos(getAgendamentos());
    setCancelandoId(null);
  };

  const copyPhone = (phone: string) => navigator.clipboard.writeText(phone);

  // Cliente não logado: não mostrar a lista (será redirecionado pelo useEffect)
  if (mounted && !barbeiro) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <p className="text-gray-400">Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Meus Agendamentos</h1>
      {mounted && barbeiro && (
        <p className="text-gray-400 text-sm mb-4 sm:mb-6">Agendamentos de {barbeiro.name}</p>
      )}
      {(!mounted || !barbeiro) && <div className="mb-4 sm:mb-6" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <section>
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Confirmados</h2>
            <ul className="space-y-3">
              {confirmados.map((a) => (
                <li
                  key={a.id}
                  className="bg-dark-800 rounded-xl border border-gray-700 p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-brand-purple text-white text-xs font-medium mb-2">Confirmado</span>
                    <p className="text-white font-medium truncate">{a.servicoNome}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden relative inline-block">
                        <Image
                          src={`https://picsum.photos/seed/barber${a.barbeiroId}/48`}
                          alt=""
                          width={24}
                          height={24}
                          className="object-cover"
                          unoptimized
                        />
                      </span>
                      {a.barbeiroNome}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{a.dataLabel} · {a.horario}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">Finalizados</h2>
            <ul className="space-y-3">
              {finalizados.map((a) => (
                <li
                  key={a.id}
                  className="bg-dark-800 rounded-xl border border-gray-700 p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-dark-600 text-gray-300 text-xs font-medium mb-2">Finalizado</span>
                    <p className="text-white font-medium truncate">{a.servicoNome}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden relative inline-block">
                        <Image
                          src={`https://picsum.photos/seed/barber${a.barbeiroId}/48`}
                          alt=""
                          width={24}
                          height={24}
                          className="object-cover"
                          unoptimized
                        />
                      </span>
                      {a.barbeiroNome}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{a.dataLabel}, {a.horario}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-800 rounded-xl border border-gray-700 p-4">
            <h3 className="font-semibold text-white mb-2">{BARBEARIA.name}</h3>
            <p className="text-gray-400 text-sm">{BARBEARIA.address}</p>
            <div className="mt-3 space-y-2">
              {BARBEARIA.phone1 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{BARBEARIA.phone1}</span>
                  <button type="button" onClick={() => copyPhone(BARBEARIA.phone1!)} className="text-brand-purple text-sm hover:underline">Copiar</button>
                </div>
              )}
              {BARBEARIA.phone2 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{BARBEARIA.phone2}</span>
                  <button type="button" onClick={() => copyPhone(BARBEARIA.phone2!)} className="text-brand-purple text-sm hover:underline">Copiar</button>
                </div>
              )}
            </div>
          </div>
          <div className="bg-dark-800 rounded-xl border border-gray-700 p-4">
            <h3 className="font-semibold text-white uppercase tracking-wide mb-2">Sobre Nós</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{BARBEARIA.about}</p>
          </div>

          {selecionado && (
            <div className="bg-dark-800 rounded-xl border border-gray-700 p-4">
              <span className="inline-block px-2 py-0.5 rounded bg-brand-purple text-white text-xs font-medium mb-3">Confirmado</span>
              <div className="flex justify-between items-start mb-2">
                <p className="text-white font-medium">{selecionado.servicoNome}</p>
                <p className="text-brand-purple font-semibold">R$ {selecionado.preco.toFixed(2).replace(".", ",")}</p>
              </div>
              <dl className="text-sm space-y-1 text-gray-400">
                <div><span className="text-gray-500">Barbeiro: </span>{selecionado.barbeiroNome}</div>
                <div><span className="text-gray-500">Data: </span>{selecionado.dataLabelLong}</div>
                <div><span className="text-gray-500">Horário: </span>{selecionado.horario}</div>
              </dl>
              <button
                type="button"
                onClick={() => setCancelandoId(selecionado.id)}
                className="mt-4 w-full py-3 rounded-xl bg-brand-red text-white font-medium hover:bg-brand-red-dark transition-colors"
              >
                Cancelar Reserva
              </button>
            </div>
          )}
        </div>
      </div>

      {cancelandoId && (
        <ModalCancelarReserva onClose={() => setCancelandoId(null)} onConfirm={handleConfirmarCancelamento} />
      )}
    </div>
  );
}
