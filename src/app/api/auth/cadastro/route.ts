import { hash } from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { createSlug } from "@/lib/slug";

const cadastroSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  barbearia: z.string().trim().min(2, "Informe o nome da barbearia."),
  slug: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const data = cadastroSchema.parse(await request.json());
    const exists = await prisma.user.findUnique({ where: { email: data.email }, select: { id: true } });
    if (exists) return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });

    const baseSlug = createSlug(data.slug || data.barbearia);
    if (!baseSlug) return NextResponse.json({ error: "Escolha um endereço público válido." }, { status: 400 });
    let slug = baseSlug;
    let suffix = 2;
    while (await prisma.barbearia.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const passwordHash = await hash(data.senha, 12);
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { name: data.nome, email: data.email, passwordHash },
      });
      const negocio = await tx.barbearia.create({
        data: {
          name: data.barbearia,
          slug,
          trialEndsAt,
          membros: { create: { userId: created.id, papel: "PROPRIETARIO" } },
          barbeiros: { create: { name: data.nome, userId: created.id } },
          horarios: {
            create: Array.from({ length: 7 }, (_, diaSemana) => ({
              diaSemana,
              abre: diaSemana === 0 ? null : "09:00",
              fecha: diaSemana === 0 ? null : "18:00",
              fechado: diaSemana === 0,
            })),
          },
        },
      });
      await tx.servico.create({
        data: { barbeariaId: negocio.id, nome: "Corte de cabelo", preco: 50, duracao: 45 },
      });
      return created;
    });

    const token = await createSessionToken({ userId: user.id });
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());
    return NextResponse.json({ ok: true, slug }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
    }
    console.error("Erro no cadastro", error);
    return NextResponse.json({ error: "Não foi possível criar sua conta." }, { status: 500 });
  }
}
