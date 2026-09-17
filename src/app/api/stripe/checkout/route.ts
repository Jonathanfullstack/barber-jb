import { NextResponse } from "next/server";
import { requireManager } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const { user, barbearia } = await requireManager();
    const stripe = getStripe();
    const price = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!price || !appUrl) throw new Error("Configuração de cobrança incompleta.");
    let customerId = barbearia.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ name: barbearia.name, email: user.email, metadata: { barbeariaId: barbearia.id } });
      customerId = customer.id;
      await prisma.barbearia.update({ where: { id: barbearia.id }, data: { stripeCustomerId: customerId } });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "subscription", customer: customerId,
      line_items: [{ price, quantity: 1 }],
      subscription_data: { metadata: { barbeariaId: barbearia.id } },
      success_url: `${appUrl}/admin?assinatura=sucesso`, cancel_url: `${appUrl}/admin?assinatura=cancelada`,
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao iniciar checkout", error);
    return NextResponse.json({ error: "Não foi possível iniciar a assinatura." }, { status: 500 });
  }
}
