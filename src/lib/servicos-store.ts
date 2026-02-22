/**
 * Store de serviços: lista inicial do mock + adições, alterações e exclusões no localStorage.
 * Usado no painel admin (adicionar, editar, excluir) e na home/agendamentos.
 */

import { SERVICOS, FALLBACK_IMAGE } from "./mock-data";

export type ServicoItem = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  imageUrl: string;
};

const STORAGE_KEY_ADDITIONS = "jb-barber-servicos-additions";
const STORAGE_KEY_UPDATES = "jb-barber-servicos-updates";
const STORAGE_KEY_REMOVED = "jb-barber-servicos-removed";

function loadAdditions(): ServicoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADDITIONS);
    if (!raw) return [];
    return JSON.parse(raw) as ServicoItem[];
  } catch {
    return [];
  }
}

function saveAdditions(lista: ServicoItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ADDITIONS, JSON.stringify(lista));
}

function loadUpdates(): Record<string, Partial<Omit<ServicoItem, "id">>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UPDATES);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Partial<Omit<ServicoItem, "id">>>;
  } catch {
    return {};
  }
}

function saveUpdates(updates: Record<string, Partial<Omit<ServicoItem, "id">>>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_UPDATES, JSON.stringify(updates));
}

function loadRemoved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMOVED);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveRemoved(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_REMOVED, JSON.stringify(ids));
}

const iniciais: ServicoItem[] = SERVICOS.map((s) => ({
  id: s.id,
  nome: s.nome,
  descricao: s.descricao ?? "",
  preco: s.preco,
  duracao: s.duracao,
  imageUrl: s.imageUrl,
}));

/** Retorna todos os serviços ativos: iniciais + adições, com alterações aplicadas, excluindo os removidos. */
export function getServicos(): ServicoItem[] {
  const additions = typeof window === "undefined" ? [] : loadAdditions();
  const updates = typeof window === "undefined" ? {} : loadUpdates();
  const removed = typeof window === "undefined" ? [] : loadRemoved();

  const byId = new Map<string, ServicoItem>();
  iniciais.forEach((s) => byId.set(s.id, { ...s }));
  additions.forEach((s) => byId.set(s.id, { ...s }));

  return Array.from(byId.values())
    .filter((s) => !removed.includes(s.id))
    .map((s) => {
      const u = updates[s.id];
      return u ? { ...s, ...u } : s;
    });
}

/** Adiciona um novo serviço. Gera id único. */
export function addServico(data: {
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  imageUrl?: string;
}): ServicoItem {
  const additions = loadAdditions();
  const id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const item: ServicoItem = {
    id,
    nome: data.nome.trim(),
    descricao: (data.descricao ?? "").trim(),
    preco: Number(data.preco) || 0,
    duracao: Number(data.duracao) || 30,
    imageUrl: (data.imageUrl ?? "").trim() || FALLBACK_IMAGE,
  };
  additions.push(item);
  saveAdditions(additions);
  return item;
}

/** Atualiza um serviço. */
export function atualizarServico(
  id: string,
  updates: Partial<Omit<ServicoItem, "id">>
): void {
  const u = loadUpdates();
  const next: Partial<ServicoItem> = {};
  if (updates.nome !== undefined) next.nome = updates.nome.trim();
  if (updates.descricao !== undefined) next.descricao = updates.descricao.trim();
  if (updates.preco !== undefined) next.preco = Number(updates.preco) || 0;
  if (updates.duracao !== undefined) next.duracao = Number(updates.duracao) || 30;
  if (updates.imageUrl !== undefined) next.imageUrl = updates.imageUrl.trim() || FALLBACK_IMAGE;
  u[id] = { ...u[id], ...next };
  saveUpdates(u);
}

/** Exclui um serviço (some da lista em todo o app). */
export function removerServico(id: string): void {
  const removed = loadRemoved();
  if (!removed.includes(id)) {
    removed.push(id);
    saveRemoved(removed);
  }
}
