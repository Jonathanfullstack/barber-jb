import { notFound } from "next/navigation";
import { Clock3, MapPin, Phone, Scissors } from "lucide-react";
import PublicBookingForm from "@/components/PublicBookingForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BarbeariaPublicaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const barbearia = await prisma.barbearia.findUnique({ where: { slug }, include: { servicos: { where: { ativo: true }, orderBy: { nome: "asc" } }, barbeiros: { where: { ativo: true }, orderBy: { name: "asc" } }, horarios: { orderBy: { diaSemana: "asc" } } } });
  if (!barbearia) notFound();
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="border-b border-border pb-7 sm:pb-9">
        <div className="flex items-start gap-4"><div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground">JB</div><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Agendamento online</p><h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{barbearia.name}</h1></div></div>
        {barbearia.about && <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{barbearia.about}</p>}
        <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-5">{barbearia.address && <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{barbearia.address}</span>}{barbearia.phone && <span className="flex items-center gap-2"><Phone className="size-4 text-primary" />{barbearia.phone}</span>}</div>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(420px,1.25fr)] lg:gap-12">
        <section className="order-2 lg:order-1"><div className="mb-4 flex items-center gap-2"><Scissors className="size-4 text-primary" /><h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Serviços</h2></div><div className="divide-y divide-border border-y border-border">{barbearia.servicos.map((service) => <div key={service.id} className="flex items-center justify-between gap-4 py-4"><div><h3 className="text-sm font-medium">{service.nome}</h3><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{service.duracao} minutos</p></div><strong className="font-mono text-sm">{money.format(Number(service.preco))}</strong></div>)}</div></section>
        <section className="surface order-1 rounded-lg p-5 sm:p-6 lg:order-2"><div className="mb-6"><h2 className="text-xl font-semibold">Reserve seu horário</h2><p className="mt-1 text-sm text-muted-foreground">Escolha o serviço, profissional e melhor momento.</p></div><PublicBookingForm slug={barbearia.slug} servicos={barbearia.servicos.map((service) => ({ id: service.id, nome: service.nome, preco: Number(service.preco), duracao: service.duracao }))} barbeiros={barbearia.barbeiros.map((barber) => ({ id: barber.id, name: barber.name }))} /></section>
      </div>
    </main>
  );
}
