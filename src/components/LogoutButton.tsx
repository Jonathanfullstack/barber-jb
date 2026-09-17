"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  return <Button type="button" variant="ghost" size={compact ? "icon" : "sm"} aria-label="Sair" onClick={async () => {
    await fetch("/api/auth/sair", { method: "POST" });
    router.push("/entrar");
    router.refresh();
  }}><LogOut />{!compact && "Sair"}</Button>;
}
