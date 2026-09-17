import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";

export { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await readSessionToken(token);
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, phone: true },
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
}

export async function requireWorkspace() {
  const user = await requireCurrentUser();
  const membership = await prisma.membro.findFirst({
    where: { userId: user.id },
    include: { barbearia: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) redirect("/cadastro");
  return { user, membership, barbearia: membership.barbearia };
}

export async function requireManager() {
  const workspace = await requireWorkspace();
  if (!(["PROPRIETARIO", "ADMIN"] as string[]).includes(workspace.membership.papel)) {
    redirect("/admin");
  }
  return workspace;
}
