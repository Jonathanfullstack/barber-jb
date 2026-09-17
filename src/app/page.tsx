import Link from "next/link";
import { ArrowRight, CalendarCheck2, Link2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const appointments = [
    { time: "09:00", service: "Corte + barba", person: "Rafael", status: "Confirmado" },
    { time: "10:15", service: "Corte clássico", person: "Marcos", status: "Confirmado" },
    { time: "11:30", service: "Barba", person: "Paulo", status: "Pendente" },
  ];
  const benefits = [
    { icon: Link2, title: "Página própria", text: "Um link simples para receber reservas a qualquer hora." },
    { icon: CalendarCheck2, title: "Agenda organizada", text: "Duração, expediente e conflitos validados automaticamente." },
    { icon: Users, title: "Equipe no mesmo lugar", text: "Serviços e profissionais separados para cada barbearia." },
  ];

  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Gestão para barbearias</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-6xl">Uma agenda que acompanha o ritmo da sua barbearia.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Receba reservas, organize profissionais e acompanhe cada atendimento em uma operação simples e profissional.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/cadastro">Começar 14 dias grátis <ArrowRight /></Link></Button><Button asChild variant="outline" size="lg"><Link href="/entrar">Acessar painel</Link></Button></div>
          <p className="mt-3 text-xs text-muted-foreground">Sem cartão para começar.</p>
        </div>

        <div className="border border-border bg-card p-3 shadow-2xl shadow-black/10 sm:p-5">
          <div className="border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-4"><div><p className="text-xs text-muted-foreground">Agenda de hoje</p><p className="mt-1 text-xl font-semibold">8 atendimentos</p></div><Badge variant="success">Online</Badge></div>
            <div className="divide-y divide-border">{appointments.map((item) => <div key={item.time} className="grid grid-cols-[54px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4"><strong className="font-mono text-sm text-primary">{item.time}</strong><div className="min-w-0"><p className="truncate text-sm font-medium">{item.service}</p><p className="text-xs text-muted-foreground">com {item.person}</p></div><span className="text-[11px] text-muted-foreground">{item.status}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40"><div className="mx-auto grid max-w-7xl divide-y divide-border px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">{benefits.map(({ icon: Icon, title, text }) => <article key={title} className="py-8 md:px-7 md:py-10 first:md:pl-0 last:md:pr-0"><Icon className="size-5 text-primary" strokeWidth={1.7} /><h2 className="mt-4 font-semibold">{title}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div></section>
    </main>
  );
}
