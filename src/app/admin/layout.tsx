import { requireWorkspace } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, barbearia } = await requireWorkspace();
  return (
    <AdminShell businessName={barbearia.name} userEmail={user.email} slug={barbearia.slug}>{children}</AdminShell>
  );
}
