"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePainelAuth } from "@/context/PainelAuthContext";

function PainelLoginContent() {
  const { barbeiro, login, isLoading } = usePainelAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginValue, setLoginValue] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [tentando, setTentando] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/painel/agendamentos";

  useEffect(() => {
    if (isLoading) return;
    if (barbeiro) {
      router.replace(redirectTo.startsWith("/admin") ? redirectTo : "/painel/agendamentos");
      return;
    }
  }, [barbeiro, isLoading, router, redirectTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setTentando(true);
    const ok = login(loginValue.trim(), senha);
    setTentando(false);
    if (ok) router.push(redirectTo.startsWith("/admin") ? redirectTo : "/painel/agendamentos");
    else setErro("Login ou senha incorretos. Tente novamente.");
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 flex justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (barbeiro) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
      <div className="bg-dark-800 rounded-2xl border border-gray-700 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-white mb-2">Área do funcionário</h1>
        <p className="text-gray-400 text-sm mb-6">
          Use seu login e senha para acessar seus agendamentos e clientes.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-300 mb-1">
              Login
            </label>
            <input
              id="login"
              type="text"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              placeholder="Seu usuário"
              required
              autoComplete="username"
              className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-300 mb-1">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              required
              autoComplete="current-password"
              className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none"
            />
          </div>
          {erro && (
            <p className="text-sm text-brand-red">{erro}</p>
          )}
          <button
            type="submit"
            disabled={tentando}
            className="w-full py-4 min-h-[48px] rounded-xl bg-brand-purple text-white font-semibold hover:bg-brand-purple-dark active:opacity-90 transition-colors disabled:opacity-50 touch-manipulation"
          >
            {tentando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="text-gray-500 text-xs mt-4 text-center">
          Demonstração: joao / 123456 — miguel / 123456 — carlos / 123456
        </p>
      </div>
    </div>
  );
}

export default function PainelLoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto px-4 py-16 flex justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    }>
      <PainelLoginContent />
    </Suspense>
  );
}
