import { revalidatePath } from "next/cache";
import { Building2, CreditCard } from "lucide-react";
import { requireManager, requireWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createSlug } from "@/lib/slug";
import BillingButton from "@/components/BillingButton";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function salvar(formData: FormData) {
  "use server";
  const { barbearia } = await requireManager();
  const name = String(formData.get("name") || "").trim();
  const slug = createSlug(String(formData.get("slug") || ""));
  if (name.length < 2 || !slug) return;
  const conflito = await prisma.barbearia.findFirst({ where: { slug, NOT: { id: barbearia.id } }, select: { id: true } });
  if (conflito) return;
  await prisma.barbearia.update({ where: { id: barbearia.id }, data: { name, slug, phone: String(formData.get("phone") || "").trim() || null, address: String(formData.get("address") || "").trim() || null, about: String(formData.get("about") || "").trim() || null } });
  revalidatePath("/admin", "layout");
}

export default async function ConfiguracoesPage() {
  const { barbearia } = await requireWorkspace();
  const fields = [
    { name: "name", label: "Nome da barbearia", value: barbearia.name, required: true },
    { name: "slug", label: "Endereço público", value: barbearia.slug, required: true },
    { name: "phone", label: "Telefone", value: barbearia.phone || "", required: false },
    { name: "address", label: "Endereço", value: barbearia.address || "", required: false },
  ];

  return (
    <div>
      <PageHeader eyebrow="Sistema" title="Configurações" description="Dados comerciais, página pública e assinatura da sua barbearia." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.65fr)]">
        <section className="surface rounded-lg">
          <div className="flex items-center gap-3 border-b border-border p-5"><Building2 className="size-5 text-primary" /><div><h2 className="font-semibold">Perfil da barbearia</h2><p className="mt-0.5 text-xs text-muted-foreground">Informações exibidas para seus clientes.</p></div></div>
          <form action={salvar} className="space-y-5 p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => <div key={field.name} className={field.name === "address" ? "sm:col-span-2" : ""}><Label htmlFor={field.name}>{field.label}</Label>{field.name === "slug" ? <div className="mt-1 flex h-10 items-center rounded-md border border-input bg-background px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"><span className="text-sm text-muted-foreground">/b/</span><input id={field.name} name={field.name} defaultValue={field.value} required={field.required} className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none" /></div> : <Input id={field.name} name={field.name} defaultValue={field.value} required={field.required} className="mt-1" />}</div>)}
            </div>
            <div><Label htmlFor="about">Sobre</Label><Textarea id="about" name="about" defaultValue={barbearia.about || ""} rows={5} className="mt-1" placeholder="Conte brevemente o que torna sua barbearia especial." /></div>
            <div className="flex justify-end border-t border-border pt-5"><Button type="submit">Salvar alterações</Button></div>
          </form>
        </section>

        <aside className="surface rounded-lg">
          <div className="flex items-center gap-3 border-b border-border p-5"><CreditCard className="size-5 text-primary" /><div><h2 className="font-semibold">Plano e cobrança</h2><p className="mt-0.5 text-xs text-muted-foreground">Gerencie sua assinatura do SaaS.</p></div></div>
          <div className="p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-muted-foreground">Status atual</span><Badge variant={barbearia.statusAssinatura === "ATIVA" ? "success" : "default"}>{barbearia.statusAssinatura.toLowerCase()}</Badge></div><BillingButton hasSubscription={!!barbearia.stripeCustomerId} /></div>
        </aside>
      </div>
    </div>
  );
}
