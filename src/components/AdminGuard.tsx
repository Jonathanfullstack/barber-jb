"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePainelAuth } from "@/context/PainelAuthContext";

/**
 * Só permite acesso ao conteúdo para funcionários (barbeiros) logados.
 * Clientes são redirecionados para o login do painel.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { barbeiro, isLoading } = usePainelAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!barbeiro) {
      router.replace("/painel?redirect=" + encodeURIComponent(pathname || "/admin"));
      return;
    }
  }, [barbeiro, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (!barbeiro) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Redirecionando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
