import { NextResponse } from "next/server";
import { requireManager } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const { barbearia } = await requireManager();
    if (!barbearia.stripeCustomerId) return NextResponse.json({ error: "Assinatura ainda não iniciada." }, { status: 400 });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL não configurada.");
    const session = await getStripe().billingPortal.sessions.create({ customer: barbearia.stripeCustomerId, return_url: `${appUrl}/admin/barbearias` });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao abrir portal", error);
    return NextResponse.json({ error: "Não foi possível abrir o portal." }, { status: 500 });
  }
}
