"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthForm({ mode }: { mode: "entrar" | "cadastro" }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [barbearia, setBarbearia] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const cadastro = mode === "cadastro";
  const publicSlug = useMemo(() => createSlug(slug || barbearia), [slug, barbearia]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cadastro ? { nome, barbearia, slug, email, senha } : { email, senha }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível continuar.");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível continuar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {cadastro ? <>
        <div><Label htmlFor="nome">Seu nome</Label><Input id="nome" value={nome} onChange={(event) => setNome(event.target.value)} required minLength={2} autoComplete="name" className="mt-1" /></div>
        <div><Label htmlFor="barbearia">Nome da barbearia</Label><Input id="barbearia" value={barbearia} onChange={(event) => setBarbearia(event.target.value)} required minLength={2} className="mt-1" /></div>
        <div><Label htmlFor="slug">Endereço público</Label><div className="mt-1 flex h-11 items-center rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"><span className="text-sm text-muted-foreground">/b/</span><input id="slug" value={slug} onChange={(event) => setSlug(createSlug(event.target.value))} placeholder={createSlug(barbearia) || "minha-barbearia"} className="min-w-0 flex-1 bg-transparent px-1 outline-none" /></div>{publicSlug && <span className="mt-1 block text-xs text-muted-foreground">Sua página: /b/{publicSlug}</span>}</div>
      </> : null}
      <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="mt-1" /></div>
      <div><Label htmlFor="senha">Senha</Label><Input id="senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required minLength={cadastro ? 8 : 1} autoComplete={cadastro ? "new-password" : "current-password"} className="mt-1" /></div>
      {erro && <p role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
      <Button disabled={enviando} size="lg" className="w-full">{enviando ? "Aguarde..." : cadastro ? "Criar minha barbearia" : "Entrar"}</Button>
      <p className="text-center text-sm text-muted-foreground">{cadastro ? "Já possui acesso?" : "Ainda não tem uma conta?"} <Link className="font-medium text-primary hover:underline" href={cadastro ? "/entrar" : "/cadastro"}>{cadastro ? "Entrar" : "Começar grátis"}</Link></p>
    </form>
  );
}
