"use client";

import { useState } from "react";
import ModalLogin from "@/components/ModalLogin";
import { useClienteAuth } from "@/context/ClienteAuthContext";

export default function PerfilPage() {
  const [showLogin, setShowLogin] = useState(false);
  const { cliente, logout } = useClienteAuth();

  const iniciais = cliente ? cliente.nome.trim().split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase() : "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Perfil</h1>
      {cliente ? (
        <div className="bg-dark-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center text-2xl font-semibold text-gray-400 border border-gray-600">
              {iniciais || "?"}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{cliente.nome}</p>
              <p className="text-gray-400 text-sm">{cliente.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 text-sm hover:bg-dark-700 hover:text-white transition-colors"
          >
            Sair
          </button>
        </div>
      ) : (
        <div className="bg-dark-800 rounded-xl border border-gray-700 p-8 text-center">
          <p className="text-gray-400 mb-4">Faça login ou crie uma conta para acessar seu perfil.</p>
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 rounded-xl bg-brand-purple text-white font-medium hover:bg-brand-purple-dark transition-colors"
          >
            Entrar ou criar conta
          </button>
        </div>
      )}

      {showLogin && <ModalLogin onClose={() => setShowLogin(false)} />}
    </div>
  );
}
