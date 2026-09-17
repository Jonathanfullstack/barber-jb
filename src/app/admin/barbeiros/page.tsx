import { revalidatePath } from "next/cache";
import { UserRound } from "lucide-react";
import { requireManager, requireWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import FormSheet from "@/components/admin/FormSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function criarBarbeiro(formData: FormData) {
  "use server";
  const { barbearia } = await requireManager();
  const name = String(formData.get("name") || "").trim();
  if (name.length < 2) return;
  await prisma.barbeiro.create({ data: { name, barbeariaId: barbearia.id } });
  revalidatePath("/admin/barbeiros");
}

async function alternarBarbeiro(formData: FormData) {
  "use server";
  const { barbearia } = await requireManager();
  const id = String(formData.get("id"));
  const item = await prisma.barbeiro.findFirst({ where: { id, barbeariaId: barbearia.id }, select: { ativo: true } });
  if (item) await prisma.barbeiro.update({ where: { id }, data: { ativo: !item.ativo } });
  revalidatePath("/admin/barbeiros");
}

export default async function BarbeirosPage() {
  const { barbearia } = await requireWorkspace();
  const barbeiros = await prisma.barbeiro.findMany({ where: { barbeariaId: barbearia.id }, orderBy: [{ ativo: "desc" }, { createdAt: "asc" }] });
  const form = <form action={criarBarbeiro} className="space-y-5"><div><Label htmlFor="name">Nome do profissional</Label><Input id="name" name="name" required minLength={2} placeholder="Nome completo" className="mt-1" /></div><Button type="submit" className="w-full">Adicionar profissional</Button></form>;

  return (
    <div>
      <PageHeader eyebrow="Gestão" title="Equipe" description="Profissionais ativos ficam disponíveis para escolha durante o agendamento." action={<FormSheet triggerLabel="Novo profissional" title="Adicionar profissional" description="Você poderá vincular um acesso individual posteriormente.">{form}</FormSheet>} />
      <p className="mb-4 text-sm text-muted-foreground">{barbeiros.length} {barbeiros.length === 1 ? "profissional" : "profissionais"}</p>
      <section className="surface overflow-hidden rounded-lg">
        <div className="divide-y divide-border">
          {barbeiros.map((barbeiro) => {
            const initials = barbeiro.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
            return (
              <article key={barbeiro.id} className="flex items-center gap-3 p-4 sm:px-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">{initials || <UserRound className="size-5" />}</div>
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="truncate text-sm font-semibold">{barbeiro.name}</h2><Badge variant={barbeiro.ativo ? "success" : "secondary"}>{barbeiro.ativo ? "Ativo" : "Inativo"}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{barbeiro.userId ? "Acesso individual vinculado" : "Sem acesso individual"}</p></div>
                <form action={alternarBarbeiro}><input type="hidden" name="id" value={barbeiro.id} /><Button type="submit" variant="ghost" size="sm">{barbeiro.ativo ? "Desativar" : "Ativar"}</Button></form>
              </article>
            );
          })}
          {!barbeiros.length && <div className="px-5 py-16 text-center"><UserRound className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-3 font-medium">Sua equipe está vazia</h2><p className="mt-1 text-sm text-muted-foreground">Adicione um profissional para abrir horários na agenda.</p></div>}
        </div>
      </section>
    </div>
  );
}
