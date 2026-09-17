import { Badge } from "@/components/ui/badge";

const statusMap = {
  PENDENTE: { label: "Pendente", variant: "warning" as const },
  CONFIRMADO: { label: "Confirmado", variant: "success" as const },
  FINALIZADO: { label: "Finalizado", variant: "secondary" as const },
  CANCELADO: { label: "Cancelado", variant: "destructive" as const },
};

export default function StatusBadge({ status }: { status: string }) {
  const item = statusMap[status as keyof typeof statusMap] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
