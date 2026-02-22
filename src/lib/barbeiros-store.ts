/**
 * Store de barbeiros: lista inicial do mock + adições e alterações no localStorage.
 * Usado no painel admin (editar/adicionar), login do painel e exibição na home/agendamentos.
 */

import { BARBEIROS, AVATAR_FUNCIONARIOS } from "./mock-data";

export type BarbeiroItem = {
  id: string;
  name: string;
  avatar: string;
  login: string;
  senha: string;
};

const STORAGE_KEY_ADDITIONS = "jb-barber-barbeiros-additions";
const STORAGE_KEY_UPDATES = "jb-barber-barbeiros-updates";

function loadAdditions(): BarbeiroItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADDITIONS);
    if (!raw) return [];
    return JSON.parse(raw) as BarbeiroItem[];
  } catch {
    return [];
  }
}

function saveAdditions(lista: BarbeiroItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ADDITIONS, JSON.stringify(lista));
}

function loadUpdates(): Record<string, Partial<Omit<BarbeiroItem, "id">>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UPDATES);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Partial<Omit<BarbeiroItem, "id">>>;
  } catch {
    return {};
  }
}

function saveUpdates(updates: Record<string, Partial<Omit<BarbeiroItem, "id">>>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_UPDATES, JSON.stringify(updates));
}

/** Lista inicial no formato do store (com senha para login). */
const iniciais: BarbeiroItem[] = BARBEIROS.map((b) => ({
  id: b.id,
  name: b.name,
  avatar: b.avatar,
  login: b.login,
  senha: b.senha,
}));

/** Retorna todos os barbeiros: iniciais + adições, com alterações aplicadas por id. */
export function getBarbeiros(): BarbeiroItem[] {
  const additions = typeof window === "undefined" ? [] : loadAdditions();
  const updates = typeof window === "undefined" ? {} : loadUpdates();

  const base = [...iniciais];
  const byId = new Map<string, BarbeiroItem>();
  base.forEach((b) => byId.set(b.id, { ...b }));
  additions.forEach((b) => byId.set(b.id, { ...b }));

  return Array.from(byId.values()).map((b) => {
    const u = updates[b.id];
    return u ? { ...b, ...u } : b;
  });
}

/** Adiciona um novo barbeiro. Gera id único. */
export function addBarbeiro(data: {
  name: string;
  login: string;
  senha: string;
  avatar?: string;
}): BarbeiroItem {
  const additions = loadAdditions();
  const id = `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const item: BarbeiroItem = {
    id,
    name: data.name.trim(),
    avatar: data.avatar?.trim() || AVATAR_FUNCIONARIOS,
    login: data.login.trim(),
    senha: data.senha,
  };
  additions.push(item);
  saveAdditions(additions);
  return item;
}

/** Atualiza um barbeiro (nome, login, senha, avatar). */
export function atualizarBarbeiro(
  id: string,
  updates: Partial<Omit<BarbeiroItem, "id">>
): void {
  const u = loadUpdates();
  const next: Partial<BarbeiroItem> = {};
  if (updates.name !== undefined) next.name = updates.name.trim();
  if (updates.login !== undefined) next.login = updates.login.trim();
  if (updates.senha !== undefined) next.senha = updates.senha;
  if (updates.avatar !== undefined) next.avatar = updates.avatar.trim() || AVATAR_FUNCIONARIOS;
  u[id] = { ...u[id], ...next };
  saveUpdates(u);
}

/** Busca barbeiro por login e senha (para o painel). */
export function buscarBarbeiroPorLogin(login: string, senha: string): BarbeiroItem | null {
  return getBarbeiros().find((b) => b.login === login && b.senha === senha) ?? null;
}
