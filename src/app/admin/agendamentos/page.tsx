import Link from "next/link";
import { revalidatePath } from "next/cache";
import { CalendarDays, ExternalLink, MoreHorizontal } from "lucide-react";
import { requireWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function atualizarStatus(formData: FormData) {
  "use server";
  const { barbearia } = await requireWorkspace();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["CONFIRMADO", "FINALIZADO", "CANCELADO"].includes(status)) return;
  await prisma.agendamento.updateMany({ where: { id, barbeariaId: barbearia.id }, data: { status: status as "CONFIRMADO" | "FINALIZADO" | "CANCELADO" } });
  revalidatePath("/admin/agendamentos");
}

const views = [
  { value: "hoje", label: "Hoje" },
  { value: "proximos", label: "Próximos" },
  { value: "todos", label: "Todos" },
];

export default async function AgendamentosPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { barbearia } = await requireWorkspace();
  const { view: rawView } = await searchParams;
  const view = views.some((item) => item.value === rawView) ? rawView! : "hoje";
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const dateFilter = view === "hoje" ? { gte: start, lt: end } : view === "proximos" ? { gte: now } : undefined;
  const itens = await prisma.agendamento.findMany({
    where: { barbeariaId: barbearia.id, ...(dateFilter ? { inicio: dateFilter } : {}) },
    include: { barbeiro: true, servico: true },
    orderBy: { inicio: view === "todos" ? "desc" : "asc" },
    take: 100,
  });
  const dayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", timeZone: barbearia.timezone });
  const shortDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: barbearia.timezone });
  const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: barbearia.timezone });
  const groups = Map.groupBy(itens, (item) => dayFormat.format(item.inicio));

  return (
    <div>
      <PageHeader
        eyebrow="Operação"
        title="Agenda"
        description="Acompanhe as reservas por horário e atualize o andamento de cada atendimento."
        action={<Button asChild><Link href={`/b/${barbearia.slug}`} target="_blank"><ExternalLink />Nova reserva</Link></Button>}
      />

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-border" role="tablist" aria-label="Período da agenda">
        {views.map((item) => <Link key={item.value} href={`/admin/agendamentos?view=${item.value}`} role="tab" aria-selected={view === item.value} className={cn("relative min-h-11 whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground", view === item.value && "text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-primary")}>{item.label}</Link>)}
      </div>

      {!itens.length ? (
        <div className="border border-dashed border-border px-5 py-16 text-center"><CalendarDays className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-3 font-medium">Nenhum agendamento neste período</h2><p className="mt-1 text-sm text-muted-foreground">Novas reservas aparecerão aqui automaticamente.</p></div>
      ) : (
        <>
          <div className="space-y-6 md:hidden">
            {Array.from(groups.entries()).map(([day, appointments]) => (
              <section key={day}>
                <h2 className="mb-2 text-xs font-semibold capitalize tracking-wide text-muted-foreground">{day}</h2>
                <div className="divide-y divide-border border-y border-border">
                  {appointments.map((item) => (
                    <article key={item.id} className="py-4">
                      <div className="flex items-start gap-3">
                        <p className="w-12 shrink-0 font-mono text-sm font-semibold text-primary">{timeFormat.format(item.inicio)}</p>
                        <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="truncate text-sm font-semibold">{item.clienteNome}</h3><StatusBadge status={item.status} /></div><p className="mt-1 text-sm text-muted-foreground">{item.servico.nome} com {item.barbeiro.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.clienteTelefone}{item.clienteEmail ? ` · ${item.clienteEmail}` : ""}</p></div>
                      </div>
                      <form action={atualizarStatus} className="ml-[60px] mt-3 flex gap-2 overflow-x-auto">
                        <input type="hidden" name="id" value={item.id} />
                        {[{ value: "CONFIRMADO", label: "Confirmar" }, { value: "FINALIZADO", label: "Finalizar" }, { value: "CANCELADO", label: "Cancelar" }].map((status) => <Button key={status.value} name="status" value={status.value} type="submit" variant={status.value === "CANCELADO" ? "ghost" : "outline"} size="sm" disabled={item.status === status.value}>{status.label}</Button>)}
                      </form>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="surface hidden overflow-hidden rounded-lg md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Data</th><th className="px-4 py-3 font-medium">Cliente</th><th className="px-4 py-3 font-medium">Atendimento</th><th className="px-4 py-3 font-medium">Profissional</th><th className="px-4 py-3 font-medium">Status</th><th className="w-12 px-4 py-3"><span className="sr-only">Ações</span></th></tr></thead>
              <tbody className="divide-y divide-border">
                {itens.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3.5"><p className="font-mono font-semibold text-primary">{timeFormat.format(item.inicio)}</p><p className="text-xs capitalize text-muted-foreground">{shortDate.format(item.inicio)}</p></td>
                    <td className="px-4 py-3.5"><p className="font-medium">{item.clienteNome}</p><p className="text-xs text-muted-foreground">{item.clienteTelefone}</p></td>
                    <td className="px-4 py-3.5">{item.servico.nome}<p className="text-xs text-muted-foreground">{item.servico.duracao} min</p></td>
                    <td className="px-4 py-3.5">{item.barbeiro.name}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3.5">
                      <form action={atualizarStatus} className="group relative">
                        <input type="hidden" name="id" value={item.id} />
                        <Button type="button" variant="ghost" size="icon"><MoreHorizontal /></Button>
                        <div className="invisible absolute right-0 top-10 z-10 w-36 rounded-md border border-border bg-popover p-1 opacity-0 shadow-xl group-focus-within:visible group-focus-within:opacity-100">
                          {[{ value: "CONFIRMADO", label: "Confirmar" }, { value: "FINALIZADO", label: "Finalizar" }, { value: "CANCELADO", label: "Cancelar" }].map((status) => <button key={status.value} name="status" value={status.value} disabled={item.status === status.value} className="flex min-h-9 w-full items-center rounded-sm px-3 text-left text-sm hover:bg-muted disabled:opacity-40">{status.label}</button>)}
                        </div>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
