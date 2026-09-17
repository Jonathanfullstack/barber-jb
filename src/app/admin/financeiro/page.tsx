import { CircleDollarSign, Clock3, ReceiptText, TrendingUp } from "lucide-react";
import { requireWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";

export default async function FinanceiroPage() {
  const { barbearia } = await requireWorkspace();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const appointments = await prisma.agendamento.findMany({
    where: { barbeariaId: barbearia.id, inicio: { gte: monthStart } },
    include: { servico: true, barbeiro: true },
    orderBy: { inicio: "desc" },
  });
  const completed = appointments.filter((item) => item.status === "FINALIZADO");
  const active = appointments.filter((item) => item.status === "CONFIRMADO" || item.status === "PENDENTE");
  const production = completed.reduce((total, item) => total + Number(item.servico.preco), 0);
  const projected = active.reduce((total, item) => total + Number(item.servico.preco), 0);
  const average = completed.length ? production / completed.length : 0;
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: barbearia.timezone });
  const metrics = [
    { label: "Produção concluída", value: money.format(production), icon: CircleDollarSign },
    { label: "Agenda em aberto", value: money.format(projected), icon: Clock3 },
    { label: "Ticket médio", value: money.format(average), icon: TrendingUp },
    { label: "Atendimentos concluídos", value: String(completed.length), icon: ReceiptText },
  ];

  return (
    <div>
      <PageHeader eyebrow="Gestão" title="Financeiro" description="Resumo operacional calculado a partir dos serviços e atendimentos deste mês." action={<Badge variant="secondary">Mês atual</Badge>} />
      <section className="surface grid overflow-hidden rounded-lg sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }, index) => <div key={label} className={`p-4 sm:p-5 ${index > 0 ? "border-t border-border sm:border-l" : ""} ${index === 2 ? "sm:border-l-0 xl:border-l" : ""} ${index >= 2 ? "sm:border-t xl:border-t-0" : ""}`}><Icon className="mb-4 size-5 text-primary" strokeWidth={1.7} /><p className="font-mono text-xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}
      </section>

      <section className="surface mt-6 overflow-hidden rounded-lg">
        <div className="border-b border-border px-4 py-4 sm:px-5"><h2 className="font-semibold">Produção recente</h2><p className="mt-0.5 text-xs text-muted-foreground">Atendimentos marcados como finalizados</p></div>
        <div className="divide-y divide-border">
          {completed.slice(0, 12).map((item) => <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_180px_120px] sm:px-5"><div className="min-w-0"><p className="truncate text-sm font-medium">{item.servico.nome}</p><p className="truncate text-xs text-muted-foreground">{item.clienteNome} · {item.barbeiro.name}</p></div><p className="hidden text-sm text-muted-foreground sm:block">{dateFormat.format(item.inicio)}</p><p className="text-right font-mono text-sm font-semibold">{money.format(Number(item.servico.preco))}</p></div>)}
          {!completed.length && <div className="px-5 py-12 text-center"><ReceiptText className="mx-auto size-6 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Nenhum atendimento finalizado neste mês</p></div>}
        </div>
      </section>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Os valores representam produção pelos preços cadastrados. Eles não confirmam recebimentos, taxas, descontos ou despesas.</p>
    </div>
  );
}
