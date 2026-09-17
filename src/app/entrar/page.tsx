import AuthForm from "@/components/AuthForm";

export default function EntrarPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-10 sm:py-16">
      <div className="surface w-full rounded-lg p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Área do gestor</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Acesse seu painel</h1>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">Gerencie agenda, equipe e serviços em um só lugar.</p>
        <AuthForm mode="entrar" />
      </div>
    </main>
  );
}
