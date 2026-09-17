"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Check, Clock3, Scissors, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Option = { id: string; nome?: string; name?: string; preco?: number; duracao?: number };
const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

export default function PublicBookingForm({ slug, servicos, barbeiros }: { slug: string; servicos: Option[]; barbeiros: Option[] }) {
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [serviceId, setServiceId] = useState(servicos[0]?.id ?? "");
  const minDate = new Date().toLocaleDateString("en-CA");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/barbearias/${slug}/agendamentos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível reservar.");
      setSucesso("Reserva confirmada. A barbearia já recebeu seu horário.");
      event.currentTarget.reset();
      setServiceId(servicos[0]?.id ?? "");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível reservar.");
    } finally {
      setEnviando(false);
    }
  }

  if (!servicos.length || !barbeiros.length) return <div className="border border-dashed border-border px-5 py-12 text-center text-sm text-muted-foreground">A agenda ainda não está disponível.</div>;

  return (
    <form onSubmit={submit} className="space-y-7">
      <fieldset>
        <legend className="mb-3 flex items-center gap-2 text-sm font-semibold"><span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs text-primary">1</span>Escolha o serviço</legend>
        <div className="space-y-2">
          {servicos.map((item) => <label key={item.id} className={cn("flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors", serviceId === item.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40")}><input type="radio" name="servicoId" value={item.id} checked={serviceId === item.id} onChange={() => setServiceId(item.id)} className="sr-only" /><span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">{serviceId === item.id ? <Check className="size-4 text-primary" /> : <Scissors className="size-4" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{item.nome}</span><span className="text-xs text-muted-foreground">{item.duracao} min</span></span><strong className="font-mono text-sm">R$ {item.preco?.toFixed(2).replace(".", ",")}</strong></label>)}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 flex items-center gap-2 text-sm font-semibold"><span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs text-primary">2</span>Profissional e horário</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label htmlFor="barbeiroId" className="flex items-center gap-1.5"><UserRound className="size-4 text-muted-foreground" />Profissional</Label><select id="barbeiroId" name="barbeiroId" required className="select-field"><option value="">Selecione</option>{barbeiros.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <div><Label htmlFor="data" className="flex items-center gap-1.5"><CalendarDays className="size-4 text-muted-foreground" />Data</Label><Input id="data" name="data" type="date" min={minDate} required className="mt-1" /></div>
          <div><Label htmlFor="horario" className="flex items-center gap-1.5"><Clock3 className="size-4 text-muted-foreground" />Horário</Label><select id="horario" name="horario" required className="select-field"><option value="">Selecione</option>{times.map((time) => <option key={time}>{time}</option>)}</select></div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 flex items-center gap-2 text-sm font-semibold"><span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs text-primary">3</span>Seus dados</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="clienteNome">Nome</Label><Input id="clienteNome" name="clienteNome" required minLength={2} autoComplete="name" className="mt-1" /></div>
          <div><Label htmlFor="clienteTelefone">WhatsApp</Label><Input id="clienteTelefone" name="clienteTelefone" required minLength={8} autoComplete="tel" className="mt-1" /></div>
          <div className="sm:col-span-2"><Label htmlFor="clienteEmail">E-mail <span className="font-normal text-muted-foreground">(opcional)</span></Label><Input id="clienteEmail" name="clienteEmail" type="email" autoComplete="email" className="mt-1" /></div>
        </div>
      </fieldset>

      {erro && <p role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
      {sucesso && <p role="status" className="rounded-md border border-success/20 bg-success/10 p-3 text-sm text-success">{sucesso}</p>}
      <Button disabled={enviando} size="lg" className="w-full">{enviando ? "Confirmando..." : "Confirmar agendamento"}</Button>
    </form>
  );
}
