// Pausas e férias dos barbeiros: armazenado no localStorage para o cliente não agendar nesses períodos.

const STORAGE_KEY = "jb-barber-pausas";

export type Pausa = {
  id: string;
  dataInicio: string; // YYYY-MM-DD
  dataFim: string;    // YYYY-MM-DD
  motivo?: string;
};

export type PausasPorBarbeiro = Record<string, Pausa[]>;

function load(): PausasPorBarbeiro {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PausasPorBarbeiro;
  } catch {
    return {};
  }
}

function save(data: PausasPorBarbeiro) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPausas(barbeiroId: string): Pausa[] {
  return load()[barbeiroId] ?? [];
}

export function setPausas(barbeiroId: string, pausas: Pausa[]) {
  const data = load();
  data[barbeiroId] = pausas;
  save(data);
}

export function addPausa(barbeiroId: string, dataInicio: string, dataFim: string, motivo?: string): Pausa {
  const pausas = getPausas(barbeiroId);
  const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const nova: Pausa = { id, dataInicio, dataFim, motivo };
  setPausas(barbeiroId, [...pausas, nova]);
  return nova;
}

export function removePausa(barbeiroId: string, pausaId: string) {
  setPausas(barbeiroId, getPausas(barbeiroId).filter((p) => p.id !== pausaId));
}

/** Verifica se uma data (YYYY-MM-DD) está dentro de alguma pausa do barbeiro */
export function barbeiroIndisponivelNaData(barbeiroId: string, data: string): boolean {
  const pausas = getPausas(barbeiroId);
  return pausas.some((p) => data >= p.dataInicio && data <= p.dataFim);
}

/** Retorna lista de barbeiros que estão disponíveis na data (não estão de pausa) */
export function barbeirosDisponiveisNaData(barbeiroIds: string[], data: string): string[] {
  return barbeiroIds.filter((id) => !barbeiroIndisponivelNaData(id, data));
}
