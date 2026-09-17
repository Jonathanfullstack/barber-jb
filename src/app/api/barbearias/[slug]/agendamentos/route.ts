import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  servicoId: z.string().min(1), barbeiroId: z.string().min(1),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), horario: z.string().regex(/^\d{2}:\d{2}$/),
  clienteNome: z.string().trim().min(2), clienteTelefone: z.string().trim().min(8),
  clienteEmail: z.union([z.string().trim().email(), z.literal("")]).optional(),
});

function minutes(value: string) { const [h, m] = value.split(":").map(Number); return h * 60 + m; }

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const data = schema.parse(await request.json());
    const { slug } = await params;
    const barbearia = await prisma.barbearia.findUnique({ where: { slug }, include: { horarios: true } });
    const trialValido = barbearia?.statusAssinatura === "TRIAL" && !!barbearia.trialEndsAt && barbearia.trialEndsAt > new Date();
    if (!barbearia || !(barbearia.statusAssinatura === "ATIVA" || trialValido)) return NextResponse.json({ error: "Agenda temporariamente indisponível." }, { status: 403 });
    const [servico, barbeiro] = await Promise.all([
      prisma.servico.findFirst({ where: { id: data.servicoId, barbeariaId: barbearia.id, ativo: true } }),
      prisma.barbeiro.findFirst({ where: { id: data.barbeiroId, barbeariaId: barbearia.id, ativo: true } }),
    ]);
    if (!servico || !barbeiro) return NextResponse.json({ error: "Serviço ou profissional inválido." }, { status: 400 });
    const inicio = new Date(`${data.data}T${data.horario}:00-03:00`);
    if (Number.isNaN(inicio.getTime()) || inicio <= new Date()) return NextResponse.json({ error: "Escolha uma data e horário futuros." }, { status: 400 });
    const fim = new Date(inicio.getTime() + servico.duracao * 60000);
    const weekday = new Date(`${data.data}T12:00:00-03:00`).getUTCDay();
    const expediente = barbearia.horarios.find((h) => h.diaSemana === weekday);
    const comeco = minutes(data.horario); const termino = comeco + servico.duracao;
    if (!expediente || expediente.fechado || !expediente.abre || !expediente.fecha || comeco < minutes(expediente.abre) || termino > minutes(expediente.fecha)) return NextResponse.json({ error: "Horário fora do expediente." }, { status: 409 });

    await prisma.$transaction(async (tx) => {
      const conflito = await tx.agendamento.findFirst({ where: { barbeiroId: barbeiro.id, status: { in: ["PENDENTE", "CONFIRMADO"] }, inicio: { lt: fim }, fim: { gt: inicio } }, select: { id: true } });
      if (conflito) throw new Error("CONFLITO");
      await tx.agendamento.create({ data: { barbeariaId: barbearia.id, barbeiroId: barbeiro.id, servicoId: servico.id, inicio, fim, clienteNome: data.clienteNome, clienteTelefone: data.clienteTelefone, clienteEmail: data.clienteEmail || null } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Dados inválidos." }, { status: 400 });
    if (error instanceof Error && error.message === "CONFLITO") return NextResponse.json({ error: "Esse horário acabou de ser reservado. Escolha outro." }, { status: 409 });
    console.error("Erro ao criar agendamento", error);
    return NextResponse.json({ error: "Não foi possível confirmar o agendamento." }, { status: 500 });
  }
}
