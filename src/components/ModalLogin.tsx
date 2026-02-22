"use client";

import { useState } from "react";
import { useClienteAuth } from "@/context/ClienteAuthContext";

type Props = { onClose: () => void };

export default function ModalLogin({ onClose }: Props) {
  const { login, criarConta } = useClienteAuth();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    if (modo === "entrar") {
      const result = login(email.trim(), senha);
      setEnviando(false);
      if (result.ok) onClose();
      else setErro(result.erro || "Erro ao entrar.");
    } else {
      const result = criarConta(nome, email, senha, confirmarSenha);
      setEnviando(false);
      if (result.ok) onClose();
      else setErro(result.erro || "Erro ao criar conta.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-dark-800 rounded-2xl border border-gray-700 w-full max-w-sm p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white mb-1 text-center">
          {modo === "entrar" ? "Entrar" : "Criar conta"}
        </h2>
        <p className="text-gray-400 text-sm mb-4 text-center">
          {modo === "entrar"
            ? "Use seu e-mail e senha para acessar."
            : "Preencha os dados para se cadastrar."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === "criar" && (
            <div>
              <label htmlFor="login-nome" className="block text-sm font-medium text-gray-300 mb-1">
                Nome
              </label>
              <input
                id="login-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
                className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
              />
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-1">
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
            />
          </div>
          <div>
            <label htmlFor="login-senha" className="block text-sm font-medium text-gray-300 mb-1">
              Senha
            </label>
            <input
              id="login-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              minLength={modo === "criar" ? 6 : undefined}
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
            />
            {modo === "criar" && (
              <p className="text-gray-500 text-xs mt-1">Mínimo 6 caracteres</p>
            )}
          </div>
          {modo === "criar" && (
            <div>
              <label htmlFor="login-confirmar" className="block text-sm font-medium text-gray-300 mb-1">
                Confirmar senha
              </label>
              <input
                id="login-confirmar"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
              />
            </div>
          )}
          {erro && <p className="text-sm text-brand-red">{erro}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="w-full py-4 min-h-[48px] rounded-xl bg-brand-purple text-white font-semibold hover:bg-brand-purple-dark active:opacity-90 transition-colors disabled:opacity-50 touch-manipulation"
          >
            {enviando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setModo(modo === "entrar" ? "criar" : "entrar");
            setErro("");
          }}
          className="w-full mt-4 py-2 text-gray-400 text-sm hover:text-white"
        >
          {modo === "entrar" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-gray-400 text-sm hover:text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
