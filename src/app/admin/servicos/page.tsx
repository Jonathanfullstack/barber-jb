import { revalidatePath } from "next/cache";
import { Clock3, Scissors } from "lucide-react";
import { requireManager, requireWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import FormSheet from "@/components/admin/FormSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function criarServico(formData: FormData) {
  "use server";
  const { barbearia } = await requireManager();
  const nome = String(formData.get("nome") || "").trim();
  const preco = Number(formData.get("preco"));
  const duracao = Number(formData.get("duracao"));
  if (nome.length < 2 || !Number.isFinite(preco) || preco <= 0 || !Number.isInteger(duracao) || duracao < 5) return;
  await prisma.servico.create({ data: { barbeariaId: barbearia.id, nome, preco, duracao } });
  revalidatePath("/admin/servicos");
}

async function alternarServico(formData: FormData) {
  "use server";
  const { barbearia } = await requireManager();
  const id = String(formData.get("id"));
  const item = await prisma.servico.findFirst({ where: { id, barbeariaId: barbearia.id }, select: { ativo: true } });
  if (item) await prisma.servico.update({ where: { id }, data: { ativo: !item.ativo } });
  revalidatePath("/admin/servicos");
}

export default async function ServicosPage() {
  const { barbearia } = await requireWorkspace();
  const servicos = await prisma.servico.findMany({ where: { barbeariaId: barbearia.id }, orderBy: [{ ativo: "desc" }, { createdAt: "desc" }] });

  const form = (
    <form action={criarServico} className="space-y-5">
      <div><Label htmlFor="nome">Nome do serviço</Label><Input id="nome" name="nome" required minLength={2} placeholder="Ex.: Corte clássico" className="mt-1" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label htmlFor="preco">Preço</Label><Input id="preco" name="preco" required min="0.01" step="0.01" type="number" placeholder="45,00" className="mt-1" /></div>
        <div><Label htmlFor="duracao">Duração</Label><Input id="duracao" name="duracao" required min="5" step="5" type="number" placeholder="45 min" className="mt-1" /></div>
      </div>
      <Button type="submit" className="w-full">Adicionar serviço</Button>
    </form>
  );

  return (
    <div>
      <PageHeader eyebrow="Catálogo" title="Serviços" description="Organize preços e durações usados para calcular a disponibilidade da agenda." action={<FormSheet triggerLabel="Novo serviço" title="Adicionar serviço" description="O serviço ficará disponível na página pública imediatamente.">{form}</FormSheet>} />

      <div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted-foreground">{servicos.length} {servicos.length === 1 ? "serviço cadastrado" : "serviços cadastrados"}</p></div>
      <section className="surface overflow-hidden rounded-lg">
        <div className="divide-y divide-border">
          {servicos.map((servico) => (
            <article key={servico.id} className="flex items-center gap-3 p-4 sm:gap-4 sm:px-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"><Scissors className="size-5" strokeWidth={1.7} /></div>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="truncate text-sm font-semibold">{servico.nome}</h2><Badge variant={servico.ativo ? "success" : "secondary"}>{servico.ativo ? "Ativo" : "Inativo"}</Badge></div><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{servico.duracao} min</p></div>
              <p className="hidden min-w-24 text-right font-mono text-sm font-semibold sm:block">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(servico.preco))}</p>
              <form action={alternarServico}><input type="hidden" name="id" value={servico.id} /><Button type="submit" variant="ghost" size="sm">{servico.ativo ? "Desativar" : "Ativar"}</Button></form>
            </article>
          ))}
          {!servicos.length && <div className="px-5 py-16 text-center"><Scissors className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-3 font-medium">Nenhum serviço cadastrado</h2><p className="mt-1 text-sm text-muted-foreground">Adicione o primeiro serviço para liberar sua agenda.</p></div>}
        </div>
      </section>
    </div>
  );
}
