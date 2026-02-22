/**
 * Store de agendamentos: persiste novos agendamentos no localStorage
 * para aparecer no painel do funcionário e na lista do cliente.
 * Também permite atualizar status de qualquer agendamento (mock ou novo).
 */

import { AGENDAMENTOS } from "./mock-data";

export type AgendamentoItem = {
  id: string;
  status: "confirmado" | "finalizado" | "cancelado";
  servicoNome: string;
  barbeiroNome: string;
  barbeiroId: string;
  clienteNome: string;
  clienteTelefone: string;
  data: string;
  horario: string;
  preco: number;
  dataLabel: string;
  dataLabelLong: string;
};

const STORAGE_KEY_NOVOS = "jb-barber-agendamentos";
const STORAGE_KEY_UPDATES = "jb-barber-agendamentos-updates";

function loadNovos(): AgendamentoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOVOS);
    if (!raw) return [];
    return JSON.parse(raw) as AgendamentoItem[];
  } catch {
    return [];
  }
}

function saveNovos(lista: AgendamentoItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_NOVOS, JSON.stringify(lista));
}

function loadUpdates(): Record<string, Partial<Pick<AgendamentoItem, "status">>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UPDATES);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Partial<Pick<AgendamentoItem, "status">>>;
  } catch {
    return {};
  }
}

function saveUpdates(updates: Record<string, Partial<Pick<AgendamentoItem, "status">>>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_UPDATES, JSON.stringify(updates));
}

/** Retorna todos os agendamentos: os iniciais (mock) + os salvos no localStorage, com updates aplicados */
export function getAgendamentos(): AgendamentoItem[] {
  const iniciais = AGENDAMENTOS as AgendamentoItem[];
  const novos = typeof window === "undefined" ? [] : loadNovos();
  const updates = typeof window === "undefined" ? {} : loadUpdates();
  
  const todos = [...iniciais, ...novos];
  
  // Aplica updates (sobrescreve status se houver update)
  return todos.map((ag) => {
    const update = updates[ag.id];
    if (update) {
      return { ...ag, ...update };
    }
    return ag;
  });
}

/** Adiciona um novo agendamento (ex.: quando o cliente confirma a reserva). */
export function addAgendamento(ag: Omit<AgendamentoItem, "id" | "status">): AgendamentoItem {
  const novos = loadNovos();
  const id = `ag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const item: AgendamentoItem = { ...ag, id, status: "confirmado" };
  novos.push(item);
  saveNovos(novos);
  return item;
}

/** Atualiza status de um agendamento (ex.: cancelar ou finalizar). Funciona para mock e novos. */
export function atualizarAgendamento(id: string, updates: Partial<Pick<AgendamentoItem, "status">>) {
  const updatesMap = loadUpdates();
  updatesMap[id] = { ...updatesMap[id], ...updates };
  saveUpdates(updatesMap);
}
