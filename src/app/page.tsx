"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CardServico from "@/components/CardServico";
import BarbeiroAvatar from "@/components/BarbeiroAvatar";
import ModalFazerReserva from "@/components/ModalFazerReserva";
import ModalReservaEfetuada from "@/components/ModalReservaEfetuada";
import { BARBEARIA, BARBEARIA_HERO_IMAGE, getDiaLabel, formatHorario } from "@/lib/mock-data";
import { getBarbeiros } from "@/lib/barbeiros-store";
import { getServicos } from "@/lib/servicos-store";
import { addAgendamento } from "@/lib/agendamentos-store";
import type { NovoAgendamento } from "@/components/ModalFazerReserva";
import type { ServicoItem } from "@/lib/servicos-store";

export default function Home() {
  const [modalReserva, setModalReserva] = useState<{ servico: ServicoItem } | null>(null);
  const [showReservaEfetuada, setShowReservaEfetuada] = useState(false);
  const barbeiros = getBarbeiros();
  const servicos = getServicos();

  const handleConfirmarReserva = (ag: NovoAgendamento) => {
    addAgendamento(ag);
    setModalReserva(null);
    setShowReservaEfetuada(true);
  };

  const copyPhone = (phone: string) => navigator.clipboard.writeText(phone);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 w-full">
      <div className="mb-10">
        <div className="relative aspect-[3/1] max-h-[320px] min-h-[200px] rounded-2xl overflow-hidden bg-dark-800">
          <Image
            src={BARBEARIA_HERO_IMAGE}
            alt={BARBEARIA.name}
            fill
            className="object-cover object-center"
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-6 pb-5 sm:pb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight pt-2">{BARBEARIA.name}</h2>
            <p className="text-gray-300 text-sm sm:text-base flex items-center gap-2 mt-1 break-words">📍 {BARBEARIA.address}</p>
            <p className="text-brand-purple text-sm sm:text-base flex items-center gap-2 mt-1">★ {BARBEARIA.rating.toFixed(1)} — {BARBEARIA.totalAvaliacoes} avaliações</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-brand-purple rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Agende com a JB Barber</h2>
            <p className="text-purple-200 text-sm mt-1">Escolha o serviço, o barbeiro e o horário.</p>
          </div>
          <Link
            href="#servicos"
            className="shrink-0 px-6 py-3 min-h-[44px] flex items-center justify-center bg-white text-brand-purple font-semibold rounded-xl hover:bg-gray-100 active:opacity-90 transition-colors touch-manipulation"
          >
            Ver serviços
          </Link>
        </div>
      </div>

      <section id="servicos" className="mt-12 scroll-mt-6">
        <h2 className="text-lg font-semibold text-white uppercase tracking-wide mb-4">Nossos Serviços</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {servicos.map((s) => (
            <CardServico
              key={s.id}
              id={s.id}
              nome={s.nome}
              descricao={s.descricao}
              preco={s.preco}
              imageUrl={s.imageUrl}
              onReservar={() => setModalReserva({ servico: s })}
            />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-white uppercase tracking-wide mb-4">Nossa Equipe</h2>
        <p className="text-gray-400 text-sm mb-4">Agende seu horário com o barbeiro de sua preferência.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {barbeiros.map((b) => (
            <div key={b.id} className="bg-dark-800 rounded-xl border border-gray-700 p-4 text-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-3">
                <BarbeiroAvatar src={b.avatar} alt={b.name} sizes="96px" className="object-cover" />
              </div>
              <h3 className="font-semibold text-white">{b.name}</h3>
              <p className="text-gray-500 text-sm">Barbeiro</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-semibold text-white uppercase tracking-wide mb-2">Sobre Nós</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{BARBEARIA.about}</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-gray-700 p-4">
          <h3 className="font-semibold text-white uppercase tracking-wide mb-2">Contato</h3>
          <div className="space-y-2">
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
          <h3 className="font-semibold text-white uppercase tracking-wide mb-2">Horários</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {BARBEARIA.horarios.map((h) => (
              <li key={h.diaSemana} className="flex justify-between">
                <span>{getDiaLabel(h.diaSemana)}</span>
                <span>{formatHorario(h.abre, h.fecha)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {modalReserva && (
        <ModalFazerReserva
          barbearia={BARBEARIA}
          servico={modalReserva.servico}
          barbeiros={barbeiros}
          onClose={() => setModalReserva(null)}
          onConfirm={handleConfirmarReserva}
        />
      )}
      {showReservaEfetuada && <ModalReservaEfetuada onClose={() => setShowReservaEfetuada(false)} />}
    </div>
  );
}
