import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(await request.text(), signature, secret); }
  catch { return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 }); }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const barbeariaId = subscription.metadata.barbeariaId;
    if (barbeariaId) {
      const ativa = event.type !== "customer.subscription.deleted" && ["active", "trialing"].includes(subscription.status);
      const atrasada = ["past_due", "unpaid", "incomplete"].includes(subscription.status);
      await prisma.barbearia.updateMany({ where: { id: barbeariaId }, data: { stripeSubscriptionId: subscription.id, statusAssinatura: ativa ? "ATIVA" : atrasada ? "ATRASADA" : "CANCELADA" } });
    }
  }
  return NextResponse.json({ received: true });
}
