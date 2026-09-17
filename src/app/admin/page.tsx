import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Scissors, UserRound } from "lucide-react";
import { requireWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const { barbearia } = await requireWorkspace();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const [hoje, proximos, servicos, equipe, agenda] = await Promise.all([
    prisma.agendamento.count({ where: { barbeariaId: barbearia.id, inicio: { gte: start, lt: end }, status: { in: ["PENDENTE", "CONFIRMADO"] } } }),
    prisma.agendamento.count({ where: { barbeariaId: barbearia.id, inicio: { gte: now }, status: { in: ["PENDENTE", "CONFIRMADO"] } } }),
    prisma.servico.count({ where: { barbeariaId: barbearia.id, ativo: true } }),
    prisma.barbeiro.count({ where: { barbeariaId: barbearia.id, ativo: true } }),
    prisma.agendamento.findMany({
      where: { barbeariaId: barbearia.id, inicio: { gte: now }, status: { in: ["PENDENTE", "CONFIRMADO"] } },
      include: { barbeiro: true, servico: true },
      orderBy: { inicio: "asc" },
      take: 6,
    }),
  ]);

  const trial = barbearia.trialEndsAt ? Math.max(0, Math.ceil((barbearia.trialEndsAt.getTime() - now.getTime()) / 86400000)) : 0;
  const dayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short", timeZone: barbearia.timezone });
  const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: barbearia.timezone });
  const metrics = [
    { label: "Atendimentos hoje", value: hoje, icon: CalendarDays },
    { label: "Próximas reservas", value: proximos, icon: Clock3 },
    { label: "Serviços ativos", value: servicos, icon: Scissors },
    { label: "Profissionais", value: equipe, icon: UserRound },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Operação"
        title={`Olá, ${barbearia.name}`}
        description="Acompanhe a agenda e mantenha a operação do dia sob controle."
        action={<Badge variant={barbearia.statusAssinatura === "ATIVA" ? "success" : "default"}>{barbearia.statusAssinatura === "TRIAL" ? `${trial} dias de teste` : barbearia.statusAssinatura.toLowerCase()}</Badge>}
      />

      <section className="surface grid overflow-hidden rounded-lg sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo do negócio">
        {metrics.map(({ label, value, icon: Icon }, index) => (
          <div key={label} className={`flex items-center gap-4 p-4 sm:p-5 ${index > 0 ? "border-t border-border sm:border-l" : ""} ${index === 2 ? "sm:border-l-0 xl:border-l" : ""} ${index >= 2 ? "sm:border-t xl:border-t-0" : ""}`}>
            <Icon className="size-5 text-primary" strokeWidth={1.7} />
            <div><p className="text-2xl font-semibold tabular-nums">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.7fr)]">
        <section className="surface overflow-hidden rounded-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
            <div><h2 className="font-semibold">Próximos horários</h2><p className="mt-0.5 text-xs text-muted-foreground">Reservas confirmadas e pendentes</p></div>
            <Button asChild variant="ghost" size="sm"><Link href="/admin/agendamentos">Ver agenda <ArrowRight /></Link></Button>
          </div>
          <div className="divide-y divide-border">
            {agenda.map((item) => (
              <div key={item.id} className="grid grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:px-5">
                <div><p className="font-mono text-sm font-semibold text-primary">{timeFormat.format(item.inicio)}</p><p className="hidden text-[11px] capitalize text-muted-foreground sm:block">{dayFormat.format(item.inicio)}</p></div>
                <div className="min-w-0"><p className="truncate text-sm font-medium">{item.clienteNome}</p><p className="truncate text-xs text-muted-foreground">{item.servico.nome} · {item.barbeiro.name}</p></div>
                <StatusBadge status={item.status} />
              </div>
            ))}
            {!agenda.length && <div className="px-5 py-12 text-center"><CalendarDays className="mx-auto size-6 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Agenda livre</p><p className="mt-1 text-xs text-muted-foreground">As próximas reservas aparecerão aqui.</p></div>}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="border-l-2 border-primary bg-primary/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Página de reservas</p>
            <h2 className="mt-2 font-semibold">Seu link está pronto para receber clientes.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Compartilhe a página pública ou confira como serviços e profissionais aparecem.</p>
            <Button asChild variant="outline" size="sm" className="mt-4"><Link href={`/b/${barbearia.slug}`} target="_blank">Abrir página <ArrowRight /></Link></Button>
          </section>
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ações rápidas</h2>
            <div className="divide-y divide-border border-y border-border">
              <Link href="/admin/servicos" className="flex min-h-12 items-center justify-between text-sm hover:text-primary"><span>Organizar serviços</span><ArrowRight className="size-4" /></Link>
              <Link href="/admin/barbeiros" className="flex min-h-12 items-center justify-between text-sm hover:text-primary"><span>Gerenciar equipe</span><ArrowRight className="size-4" /></Link>
              <Link href="/admin/barbearias" className="flex min-h-12 items-center justify-between text-sm hover:text-primary"><span>Editar dados públicos</span><ArrowRight className="size-4" /></Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
