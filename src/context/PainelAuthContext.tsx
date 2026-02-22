"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type BarbeiroLogado = {
  id: string;
  name: string;
  avatar: string;
  login: string;
};

const STORAGE_KEY = "jb-barber-painel-barbeiro";

const PainelAuthContext = createContext<{
  barbeiro: BarbeiroLogado | null;
  login: (login: string, senha: string) => boolean;
  logout: () => void;
  isLoading: boolean;
} | null>(null);

export function PainelAuthProvider({ children }: { children: ReactNode }) {
  const [barbeiro, setBarbeiro] = useState<BarbeiroLogado | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as BarbeiroLogado;
        if (data?.id && data?.name) setBarbeiro(data);
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((loginValue: string, senha: string): boolean => {
    const { buscarBarbeiroPorLogin } = require("@/lib/barbeiros-store");
    const b = buscarBarbeiroPorLogin(loginValue, senha);
    if (!b) return false;
    const barbeiroLogado: BarbeiroLogado = {
      id: b.id,
      name: b.name,
      avatar: b.avatar,
      login: b.login,
    };
    setBarbeiro(barbeiroLogado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(barbeiroLogado));
    return true;
  }, []);

  const logout = useCallback(() => {
    setBarbeiro(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <PainelAuthContext.Provider value={{ barbeiro, login, logout, isLoading }}>
      {children}
    </PainelAuthContext.Provider>
  );
}

export function usePainelAuth() {
  const ctx = useContext(PainelAuthContext);
  if (!ctx) throw new Error("usePainelAuth must be used within PainelAuthProvider");
  return ctx;
}
