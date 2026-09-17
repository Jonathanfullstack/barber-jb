import { CalendarDays, Phone, Users } from "lucide-react";
import { requireWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";

type ClientSummary = {
  key: string;
  name: string;
  phone: string;
  email: string | null;
  visits: number;
  completed: number;
  lastVisit: Date;
  lastService: string;
};

export default async function ClientesPage() {
  const { barbearia } = await requireWorkspace();
  const appointments = await prisma.agendamento.findMany({
    where: { barbeariaId: barbearia.id },
    include: { servico: true },
    orderBy: { inicio: "desc" },
  });
  const index = new Map<string, ClientSummary>();
  for (const item of appointments) {
    const key = item.clienteTelefone.replace(/\D/g, "") || item.clienteEmail || item.clienteNome.toLowerCase();
    const current = index.get(key);
    if (current) {
      current.visits += 1;
      if (item.status === "FINALIZADO") current.completed += 1;
    } else {
      index.set(key, { key, name: item.clienteNome, phone: item.clienteTelefone, email: item.clienteEmail, visits: 1, completed: item.status === "FINALIZADO" ? 1 : 0, lastVisit: item.inicio, lastService: item.servico.nome });
    }
  }
  const clients = Array.from(index.values()).sort((a, b) => b.lastVisit.getTime() - a.lastVisit.getTime());
  const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: barbearia.timezone });

  return (
    <div>
      <PageHeader eyebrow="Relacionamento" title="Clientes" description="Visão consolidada a partir das reservas recebidas pela sua barbearia." />
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Users className="size-4" /><span>{clients.length} {clients.length === 1 ? "cliente identificado" : "clientes identificados"}</span></div>

      {!clients.length ? <div className="border border-dashed border-border px-5 py-16 text-center"><Users className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-3 font-medium">Nenhum cliente ainda</h2><p className="mt-1 text-sm text-muted-foreground">Os clientes serão agrupados conforme novas reservas chegarem.</p></div> : <>
        <div className="space-y-2 md:hidden">
          {clients.map((client) => <article key={client.key} className="surface rounded-lg p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-sm font-semibold">{client.name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Phone className="size-3" />{client.phone}</p>{client.email && <p className="mt-1 truncate text-xs text-muted-foreground">{client.email}</p>}</div><Badge variant="secondary">{client.visits} {client.visits === 1 ? "reserva" : "reservas"}</Badge></div><div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground"><span>{client.lastService}</span><span>{dateFormat.format(client.lastVisit)}</span></div></article>)}
        </div>
        <div className="surface hidden overflow-hidden rounded-lg md:block"><table className="w-full text-left text-sm"><thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Cliente</th><th className="px-4 py-3 font-medium">Contato</th><th className="px-4 py-3 font-medium">Última reserva</th><th className="px-4 py-3 text-center font-medium">Reservas</th><th className="px-4 py-3 text-center font-medium">Concluídas</th></tr></thead><tbody className="divide-y divide-border">{clients.map((client) => <tr key={client.key} className="hover:bg-muted/30"><td className="px-4 py-3.5 font-medium">{client.name}</td><td className="px-4 py-3.5"><p>{client.phone}</p>{client.email && <p className="text-xs text-muted-foreground">{client.email}</p>}</td><td className="px-4 py-3.5"><p>{client.lastService}</p><p className="text-xs text-muted-foreground">{dateFormat.format(client.lastVisit)}</p></td><td className="px-4 py-3.5 text-center tabular-nums">{client.visits}</td><td className="px-4 py-3.5 text-center tabular-nums">{client.completed}</td></tr>)}</tbody></table></div>
      </>}
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><CalendarDays className="mt-0.5 size-3.5 shrink-0" />Clientes são agrupados pelo telefone informado no agendamento. Esta tela não altera cadastros nem cria uma nova entidade no banco.</p>
    </div>
  );
}
