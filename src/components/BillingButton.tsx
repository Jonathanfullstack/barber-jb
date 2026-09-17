"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BillingButton({ hasSubscription }: { hasSubscription: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function open() {
    setLoading(true); setError("");
    try {
      const response = await fetch(hasSubscription ? "/api/stripe/portal" : "/api/stripe/checkout", { method: "POST" });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Não foi possível continuar.");
      window.location.assign(result.url);
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível continuar."); setLoading(false); }
  }
  return <div><Button type="button" onClick={open} disabled={loading} className="w-full">{loading ? "Abrindo..." : hasSubscription ? "Gerenciar assinatura" : "Assinar agora"}</Button>{error && <p className="mt-2 text-sm text-destructive">{error}</p>}</div>;
}
