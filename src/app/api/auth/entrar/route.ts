import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  senha: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const data = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await compare(data.senha, user.passwordHash))) {
      return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }
    const token = await createSessionToken({ userId: user.id });
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Informe e-mail e senha válidos." }, { status: 400 });
    }
    console.error("Erro no login", error);
    return NextResponse.json({ error: "Não foi possível entrar." }, { status: 500 });
  }
}
