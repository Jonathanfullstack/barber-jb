"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import BarbeiroAvatar from "@/components/BarbeiroAvatar";
import { barbeiroIndisponivelNaData } from "@/lib/pausas";

type Barbearia = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  rating: number;
};

type Barbeiro = {
  id: string;
  name: string;
  avatar: string;
};

type Servico = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  imageUrl: string;
};

export type NovoAgendamento = {
  barbeiroId: string;
  barbeiroNome: string;
  servicoNome: string;
  preco: number;
  data: string;
  horario: string;
  dataLabel: string;
  dataLabelLong: string;
  clienteNome: string;
  clienteTelefone: string;
};

type Props = {
  barbearia: Barbearia;
  servico: Servico;
  barbeiros: Barbeiro[];
  onClose: () => void;
  onConfirm: (ag: NovoAgendamento) => void;
};

const HORARIOS = ["09:00", "09:45", "10:30", "11:15", "14:00", "15:00", "16:30", "17:00"];

const MESES: string[] = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getDiasNoMes(ano: number, mes: number): number {
  return new Date(ano, mes, 0).getDate();
}

function getPrimeiroDiaSemana(ano: number, mes: number): number {
  return new Date(ano, mes - 1, 1).getDay();
}

function dataNoPassado(ano: number, mes: number, dia: number): boolean {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const d = new Date(ano, mes - 1, dia);
  return d < hoje;
}

export default function ModalFazerReserva({ barbearia, servico, barbeiros, onClose, onConfirm }: Props) {
  const hoje = new Date();
  const [step, setStep] = useState<1 | 2>(1);
  const [barbeiro, setBarbeiro] = useState<Barbeiro | null>(null);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [dia, setDia] = useState<number | null>(null);
  const [horario, setHorario] = useState("09:45");
  const [barbeiroEmPausa, setBarbeiroEmPausa] = useState(false);

  const diasNoMes = useMemo(() => getDiasNoMes(ano, mes), [ano, mes]);
  const primeiroDia = useMemo(() => getPrimeiroDiaSemana(ano, mes), [ano, mes]);

  const dataStr = dia !== null
    ? `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
    : "";
  const dataLabel = dia !== null
    ? `${dia} de ${MESES[mes - 1]} de ${ano}`
    : "Selecione uma data";

  useEffect(() => {
    if (dia !== null && dia > diasNoMes) setDia(null);
  }, [mes, ano, diasNoMes, dia]);

  useEffect(() => {
    if (!barbeiro || !dataStr) setBarbeiroEmPausa(false);
    else setBarbeiroEmPausa(barbeiroIndisponivelNaData(barbeiro.id, dataStr));
  }, [barbeiro, dataStr]);

  const avancarMes = () => {
    if (mes === 12) {
      setMes(1);
      setAno((a) => a + 1);
    } else setMes((m) => m + 1);
    setDia(null);
  };

  const voltarMes = () => {
    if (mes === 1) {
      setMes(12);
      setAno((a) => a - 1);
    } else setMes((m) => m - 1);
    setDia(null);
  };

  const diasCalendario = useMemo(() => {
    const vazios = Array(primeiroDia).fill(null);
    const dias = Array.from({ length: diasNoMes }, (_, i) => i + 1);
    return [...vazios, ...dias];
  }, [primeiroDia, diasNoMes]);

  const maxMesesFrente = 12;
  const limiteFuturo = new Date(hoje.getFullYear(), hoje.getMonth() + maxMesesFrente, 1);
  const limiteAno = limiteFuturo.getFullYear();
  const limiteMes = limiteFuturo.getMonth() + 1;
  const podeAvancar = ano < limiteAno || (ano === limiteAno && mes < limiteMes);
  const podeVoltar = ano > hoje.getFullYear() || (ano === hoje.getFullYear() && mes > hoje.getMonth() + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 safe-area-inset" onClick={onClose}>
      <div
        className="bg-dark-800 w-full sm:max-w-md sm:rounded-2xl border-t sm:border border-gray-700 max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 min-h-[56px] border-b border-gray-700 sticky top-0 bg-dark-800 z-10 shrink-0">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📅</span> Fazer Reserva
          </h2>
          <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white rounded-lg" aria-label="Fechar">✕</button>
        </div>

        <div className="p-4 pb-8 space-y-4 overflow-y-auto">
          <div className="bg-dark-700 rounded-xl p-3">
            <p className="text-gray-400 text-xs">Serviço escolhido</p>
            <p className="text-white font-medium">{servico.nome}</p>
            <p className="text-brand-purple font-semibold text-sm">R$ {servico.preco.toFixed(2).replace(".", ",")}</p>
          </div>

          {step === 1 ? (
            <>
              <p className="text-white font-medium">Com qual barbeiro deseja agendar?</p>
              <div className="space-y-2">
                {barbeiros.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBarbeiro(b)}
                    className={`w-full flex items-center gap-3 p-4 min-h-[56px] rounded-xl border transition-colors touch-manipulation ${
                      barbeiro?.id === b.id ? "border-brand-purple bg-brand-purple/10" : "border-gray-700 hover:border-gray-600 active:bg-dark-600"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <BarbeiroAvatar src={b.avatar} alt={b.name} sizes="48px" className="object-cover" />
                    </div>
                    <span className="text-white font-medium">{b.name}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => barbeiro && setStep(2)}
                disabled={!barbeiro}
                className="w-full py-4 min-h-[48px] rounded-xl bg-brand-purple text-white font-semibold hover:bg-brand-purple-dark active:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                Continuar
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Barbeiro:</span>
                <span className="text-white font-medium">{barbeiro?.name}</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Escolha o mês e o dia</p>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <button
                    type="button"
                    onClick={voltarMes}
                    disabled={!podeVoltar}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                    aria-label="Mês anterior"
                  >
                    ←
                  </button>
                  <span className="text-white font-medium capitalize min-w-[140px] text-center">
                    {MESES[mes - 1]} {ano}
                  </span>
                  <button
                    type="button"
                    onClick={avancarMes}
                    disabled={!podeAvancar}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                    aria-label="Próximo mês"
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-400">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
                {diasCalendario.map((d, i) => {
                  if (d === null) return <span key={`e-${i}`} />;
                  const passado = dataNoPassado(ano, mes, d);
                  const selected = dia === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => !passado && setDia(d)}
                      disabled={passado}
                      className={`min-h-[40px] rounded-lg text-sm touch-manipulation ${
                        passado
                          ? "text-gray-600 cursor-not-allowed"
                          : selected
                          ? "bg-brand-purple text-white"
                          : "hover:bg-dark-700 active:bg-dark-600 text-gray-300"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Horário</p>
                <div className="flex flex-wrap gap-2">
                  {HORARIOS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHorario(h)}
                      className={`px-4 py-3 min-h-[44px] rounded-lg text-sm touch-manipulation ${
                        horario === h ? "bg-brand-purple text-white" : "bg-dark-700 text-gray-300 hover:bg-dark-600 active:bg-dark-500"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              {barbeiroEmPausa && (
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 text-amber-200 text-sm">
                  Este barbeiro não está disponível nesta data (folga/férias). Escolha outra data ou outro barbeiro.
                </div>
              )}
              <div className="bg-dark-700 rounded-xl p-4 space-y-2">
                <p className="text-white font-medium">{servico.nome}</p>
                <p className="text-brand-purple font-semibold">R$ {servico.preco.toFixed(2).replace(".", ",")}</p>
                <p className="text-gray-400 text-sm">Barbeiro: {barbeiro?.name}</p>
                <p className="text-gray-400 text-sm">Data: {dataLabel}</p>
                <p className="text-gray-400 text-sm">Horário: {horario}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 min-h-[48px] rounded-xl bg-dark-700 text-white font-medium hover:bg-dark-600 active:opacity-90 touch-manipulation"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!barbeiro || dia === null) return;
                    onConfirm({
                      barbeiroId: barbeiro.id,
                      barbeiroNome: barbeiro.name,
                      servicoNome: servico.nome,
                      preco: servico.preco,
                      data: dataStr,
                      horario,
                      dataLabel,
                      dataLabelLong: dataLabel,
                      clienteNome: "Cliente",
                      clienteTelefone: "",
                    });
                  }}
                  disabled={!!barbeiroEmPausa || dia === null}
                  className="flex-1 py-4 min-h-[48px] rounded-xl bg-brand-purple text-white font-semibold hover:bg-brand-purple-dark active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  Confirmar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
