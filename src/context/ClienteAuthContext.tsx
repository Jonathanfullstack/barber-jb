"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ClienteLogado = {
  nome: string;
  email: string;
};

type ClienteCadastrado = {
  nome: string;
  email: string;
  senha: string;
};

const STORAGE_CLIENTES = "jb-barber-clientes";
const STORAGE_LOGADO = "jb-barber-cliente-logado";

function loadClientes(): ClienteCadastrado[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_CLIENTES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveClientes(lista: ClienteCadastrado[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(lista));
}

const ClienteAuthContext = createContext<{
  cliente: ClienteLogado | null;
  login: (email: string, senha: string) => { ok: boolean; erro?: string };
  criarConta: (nome: string, email: string, senha: string, confirmarSenha: string) => { ok: boolean; erro?: string };
  logout: () => void;
} | null>(null);

export function ClienteAuthProvider({ children }: { children: ReactNode }) {
  const [cliente, setCliente] = useState<ClienteLogado | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LOGADO);
      if (stored) {
        const data = JSON.parse(stored) as ClienteLogado;
        if (data?.email && data?.nome) setCliente(data);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback((email: string, senha: string) => {
    const clientes = loadClientes();
    const normalizado = email.trim().toLowerCase();
    const c = clientes.find((x) => x.email.toLowerCase() === normalizado);
    if (!c) return { ok: false, erro: "E-mail não cadastrado." };
    if (c.senha !== senha) return { ok: false, erro: "Senha incorreta." };
    const logado: ClienteLogado = { nome: c.nome, email: c.email };
    setCliente(logado);
    localStorage.setItem(STORAGE_LOGADO, JSON.stringify(logado));
    return { ok: true };
  }, []);

  const criarConta = useCallback((nome: string, email: string, senha: string, confirmarSenha: string) => {
    const nomeTrim = nome.trim();
    const emailTrim = email.trim().toLowerCase();
    if (!nomeTrim) return { ok: false, erro: "Digite seu nome." };
    if (!emailTrim) return { ok: false, erro: "Digite seu e-mail." };
    if (senha.length < 6) return { ok: false, erro: "A senha deve ter no mínimo 6 caracteres." };
    if (senha !== confirmarSenha) return { ok: false, erro: "As senhas não coincidem." };
    const clientes = loadClientes();
    if (clientes.some((x) => x.email.toLowerCase() === emailTrim)) {
      return { ok: false, erro: "Este e-mail já está cadastrado." };
    }
    clientes.push({ nome: nomeTrim, email: emailTrim, senha });
    saveClientes(clientes);
    const logado: ClienteLogado = { nome: nomeTrim, email: emailTrim };
    setCliente(logado);
    localStorage.setItem(STORAGE_LOGADO, JSON.stringify(logado));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setCliente(null);
    localStorage.removeItem(STORAGE_LOGADO);
  }, []);

  return (
    <ClienteAuthContext.Provider value={{ cliente, login, criarConta, logout }}>
      {children}
    </ClienteAuthContext.Provider>
  );
}

export function useClienteAuth() {
  const ctx = useContext(ClienteAuthContext);
  if (!ctx) throw new Error("useClienteAuth must be used within ClienteAuthProvider");
  return ctx;
}
