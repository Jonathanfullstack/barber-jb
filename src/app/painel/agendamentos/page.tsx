"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BarbeiroAvatar from "@/components/BarbeiroAvatar";
import { usePainelAuth } from "@/context/PainelAuthContext";
import { getAgendamentos, atualizarAgendamento } from "@/lib/agendamentos-store";
import { faturamentoNoMes } from "@/lib/mock-data";
import { getPausas, addPausa, removePausa, type Pausa } from "@/lib/pausas";
import Link from "next/link";

function formatarDataBr(d: string) {
  const [y, m, day] = d.split("-");
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${Number(day)} ${meses[Number(m) - 1]} ${y}`;
}

export default function PainelAgendamentosPage() {
  const { barbeiro, logout, isLoading } = usePainelAuth();
  const router = useRouter();
  const [pausas, setPausas] = useState<Pausa[]>([]);

  useEffect(() => {
    if (!isLoading && !barbeiro) router.replace("/painel");
  }, [barbeiro, isLoading, router]);

  const [listaAgendamentos, setListaAgendamentos] = useState<ReturnType<typeof getAgendamentos>>([]);

  useEffect(() => {
    setListaAgendamentos(getAgendamentos());
  }, []);

  useEffect(() => {
    if (barbeiro) setPausas(getPausas(barbeiro.id));
  }, [barbeiro]);

  // Atualiza a lista quando necessário (ex: após finalizar)
  const refreshAgendamentos = () => {
    setListaAgendamentos(getAgendamentos());
  };

  const meusAgendamentos = barbeiro
    ? listaAgendamentos.filter((a) => a.barbeiroId === barbeiro.id)
    : [];
  const confirmados = meusAgendamentos.filter((a) => a.status === "confirmado");
  const finalizados = meusAgendamentos.filter((a) => a.status === "finalizado");

  const agora = new Date();

  // Filtro de finanças: mês e ano
  const [filtroAno, setFiltroAno] = useState(agora.getFullYear());
  const [filtroMes, setFiltroMes] = useState(agora.getMonth() + 1);

  const faturamentoMesFiltrado = barbeiro ? faturamentoNoMes(barbeiro.id, filtroAno, filtroMes, listaAgendamentos) : 0;
  const nomeMesFiltrado = new Date(filtroAno, filtroMes - 1, 1).toLocaleDateString("pt-BR", { month: "long" });
  const mesAnterior = filtroMes === 1 ? 12 : filtroMes - 1;
  const anoAnterior = filtroMes === 1 ? filtroAno - 1 : filtroAno;
  const faturamentoMesAnterior = barbeiro ? faturamentoNoMes(barbeiro.id, anoAnterior, mesAnterior, listaAgendamentos) : 0;
  const nomeMesAnterior = new Date(anoAnterior, mesAnterior - 1, 1).toLocaleDateString("pt-BR", { month: "long" });
  const totalGeral = barbeiro
    ? listaAgendamentos
        .filter((a) => a.barbeiroId === barbeiro.id && a.status === "finalizado")
        .reduce((s, a) => s + a.preco, 0)
    : 0;

  const MESES_OPCOES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => agora.getFullYear() - i);

  const [novaDataInicio, setNovaDataInicio] = useState("");
  const [novaDataFim, setNovaDataFim] = useState("");
  const [novoMotivo, setNovoMotivo] = useState("");

  const handleAdicionarPausa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barbeiro || !novaDataInicio.trim()) return;
    const fim = novaDataFim.trim() || novaDataInicio.trim();
    if (fim < novaDataInicio) return;
    addPausa(barbeiro.id, novaDataInicio.trim(), fim, novoMotivo.trim() || undefined);
    setPausas(getPausas(barbeiro.id));
    setNovaDataInicio("");
    setNovaDataFim("");
    setNovoMotivo("");
  };

  const handleRemoverPausa = (pausaId: string) => {
    if (!barbeiro) return;
    removePausa(barbeiro.id, pausaId);
    setPausas(getPausas(barbeiro.id));
  };

  const handleFinalizarAgendamento = (agendamentoId: string) => {
    atualizarAgendamento(agendamentoId, { status: "finalizado" });
    refreshAgendamentos();
  };

  if (isLoading || !barbeiro) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-dark-700">
            <BarbeiroAvatar src={barbeiro.avatar} alt={barbeiro.name} sizes="48px" className="object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Meus clientes</h1>
            <p className="text-gray-400 text-sm">Olá, {barbeiro.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/painel/agendamentos"
            className="px-4 py-2 rounded-lg bg-brand-purple text-white text-sm font-medium"
          >
            Agendamentos
          </Link>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 text-sm hover:bg-dark-700 hover:text-white"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Parte financeira */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-white">Faturamento</h2>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-gray-400 text-sm">Filtrar:</label>
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(Number(e.target.value))}
              className="bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            >
              {MESES_OPCOES.map((nome, i) => (
                <option key={i} value={i + 1}>{nome}</option>
              ))}
            </select>
            <select
              value={filtroAno}
              onChange={(e) => setFiltroAno(Number(e.target.value))}
              className="bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            >
              {anosDisponiveis.map((ano) => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-dark-800 rounded-xl border border-brand-purple/50 p-5">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Mês selecionado</h3>
            <p className="text-2xl font-bold text-white">
              R$ {faturamentoMesFiltrado.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-gray-500 text-sm capitalize">{nomeMesFiltrado} {filtroAno}</p>
          </div>
          <div className="bg-dark-800 rounded-xl border border-gray-700 p-5">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Mês anterior</h3>
            <p className="text-2xl font-bold text-white">
              R$ {faturamentoMesAnterior.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-gray-500 text-sm capitalize">{nomeMesAnterior} {anoAnterior}</p>
          </div>
          <div className="bg-dark-800 rounded-xl border border-gray-700 p-5">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Total geral</h3>
            <p className="text-2xl font-bold text-brand-purple">
              R$ {totalGeral.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-gray-500 text-sm">Todos os finalizados</p>
          </div>
        </div>
      </section>

      {/* Pausas e férias */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">Pausas e férias</h2>
        <p className="text-gray-400 text-sm mb-4">
          Marque os dias em que não vai trabalhar. Ninguém poderá agendar com você nessas datas.
        </p>
        <div className="bg-dark-800 rounded-xl border border-gray-700 p-4 mb-4">
          <form onSubmit={handleAdicionarPausa} className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs">Data início</label>
              <input
                type="date"
                value={novaDataInicio}
                onChange={(e) => setNovaDataInicio(e.target.value)}
                required
                className="bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs">Data fim (ou igual para 1 dia)</label>
              <input
                type="date"
                value={novaDataFim}
                onChange={(e) => setNovaDataFim(e.target.value)}
                min={novaDataInicio || undefined}
                className="bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div className="flex flex-col gap-1 sm:min-w-[140px]">
              <label className="text-gray-400 text-xs">Motivo (opcional)</label>
              <input
                type="text"
                value={novoMotivo}
                onChange={(e) => setNovoMotivo(e.target.value)}
                placeholder="Ex: férias, folga"
                className="bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple-dark"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
        {pausas.length > 0 ? (
          <ul className="space-y-2">
            {pausas.map((p) => (
              <li
                key={p.id}
                className="bg-dark-800 rounded-lg border border-gray-700 px-4 py-3 flex flex-wrap items-center justify-between gap-2"
              >
                <span className="text-white text-sm">
                  {formatarDataBr(p.dataInicio)}
                  {p.dataFim !== p.dataInicio && ` até ${formatarDataBr(p.dataFim)}`}
                  {p.motivo && <span className="text-gray-400"> — {p.motivo}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoverPausa(p.id)}
                  className="text-brand-red text-sm hover:underline"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Nenhuma pausa cadastrada.</p>
        )}
      </section>

      {/* Agendamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-3">
            Confirmados
          </h2>
          <ul className="space-y-3">
            {confirmados.length === 0 ? (
              <li className="bg-dark-800 rounded-xl border border-gray-700 p-4 text-gray-500 text-sm">
                Nenhum agendamento confirmado.
              </li>
            ) : (
              confirmados.map((a) => (
                <li
                  key={a.id}
                  className="bg-dark-800 rounded-xl border border-gray-700 p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-brand-purple text-white text-xs font-medium">
                      Confirmado
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFinalizarAgendamento(a.id)}
                      className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors"
                    >
                      Finalizar
                    </button>
                  </div>
                  <p className="text-white font-medium">{a.servicoNome}</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Cliente: {(a as { clienteNome?: string }).clienteNome ?? "—"}
                  </p>
                  {(a as { clienteTelefone?: string }).clienteTelefone && (
                    <p className="text-gray-400 text-sm">
                      Tel: {(a as { clienteTelefone: string }).clienteTelefone}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {a.dataLabel} · {a.horario} — R$ {a.preco.toFixed(2).replace(".", ",")}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-3">
            Finalizados
          </h2>
          <ul className="space-y-3">
            {finalizados.length === 0 ? (
              <li className="bg-dark-800 rounded-xl border border-gray-700 p-4 text-gray-500 text-sm">
                Nenhum agendamento finalizado.
              </li>
            ) : (
              finalizados.map((a) => (
                <li
                  key={a.id}
                  className="bg-dark-800 rounded-xl border border-gray-700 p-4"
                >
                  <span className="inline-block px-2 py-0.5 rounded bg-dark-600 text-gray-300 text-xs font-medium mb-2">
                    Finalizado
                  </span>
                  <p className="text-white font-medium">{a.servicoNome}</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Cliente: {(a as { clienteNome?: string }).clienteNome ?? "—"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {a.dataLabel}, {a.horario} — R$ {a.preco.toFixed(2).replace(".", ",")}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
