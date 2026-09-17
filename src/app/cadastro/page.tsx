import AuthForm from "@/components/AuthForm";

export default function CadastroPage() {
  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10 sm:py-16">
      <div className="surface rounded-lg p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">14 dias grátis</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Crie sua barbearia</h1>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">Seu painel e sua página pública ficam prontos em poucos segundos.</p>
        <AuthForm mode="cadastro" />
      </div>
    </main>
  );
}
