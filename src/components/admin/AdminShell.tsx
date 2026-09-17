"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  MoreHorizontal,
  Scissors,
  Settings,
  Users,
  UserRound,
  WalletCards,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, group: "Operação" },
  { href: "/admin/agendamentos", label: "Agenda", icon: CalendarDays, group: "Operação" },
  { href: "/admin/clientes", label: "Clientes", icon: Users, group: "Operação" },
  { href: "/admin/servicos", label: "Serviços", icon: Scissors, group: "Gestão" },
  { href: "/admin/barbeiros", label: "Equipe", icon: UserRound, group: "Gestão" },
  { href: "/admin/financeiro", label: "Financeiro", icon: WalletCards, group: "Gestão" },
  { href: "/admin/barbearias", label: "Configurações", icon: Settings, group: "Sistema" },
];

const mobilePrimary = navItems.slice(0, 4);

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function NavLink({ item, pathname, compact = false, onNavigate }: { item: (typeof navItems)[number]; pathname: string; compact?: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={compact ? item.label : undefined}
      className={cn(
        "group flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
        active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        compact && "justify-center px-0",
      )}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
      {!compact && <span>{item.label}</span>}
    </Link>
  );
}

export default function AdminShell({ children, businessName, userEmail, slug }: { children: ReactNode; businessName: string; userEmail: string; slug: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const current = navItems.find((item) => isActive(pathname, item.href));

  return (
    <div className="min-h-[100dvh] bg-background text-foreground md:flex">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 border-r border-border bg-sidebar transition-[width] duration-200 md:flex md:flex-col", collapsed ? "w-[72px]" : "w-64")}>
        <div className={cn("flex h-16 items-center border-b border-border", collapsed ? "justify-center px-2" : "justify-between px-4")}>
          <Link href="/admin" className="flex min-w-0 items-center gap-3" aria-label="JB Barber">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground">JB</span>
            {!collapsed && <span className="truncate text-sm font-semibold tracking-wide">{businessName}</span>}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Navegação principal">
          {["Operação", "Gestão", "Sistema"].map((group) => (
            <div key={group} className="mb-6">
              {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">{group}</p>}
              <div className="space-y-1">
                {navItems.filter((item) => item.group === group).map((item) => <NavLink key={item.href} item={item} pathname={pathname} compact={collapsed} />)}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          {!collapsed && <div className="mb-3 min-w-0 px-2"><p className="truncate text-sm font-medium">{businessName}</p><p className="truncate text-xs text-muted-foreground">{userEmail}</p></div>}
          <div className={cn("flex items-center", collapsed ? "flex-col gap-1" : "justify-between")}>
            <Button variant="ghost" size="icon" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expandir menu" : "Recolher menu"}>
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
            <LogoutButton compact={collapsed} />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/95 px-4 backdrop-blur md:h-16 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground md:hidden">JB</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold md:text-base">{current?.label ?? "Painel"}</p>
              <p className="truncate text-[11px] text-muted-foreground md:hidden">{businessName}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href={`/b/${slug}`} target="_blank"><ExternalLink /> Página pública</Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] px-4 pb-28 pt-5 sm:px-6 md:pb-10 md:pt-7 lg:px-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/97 pb-[var(--safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Navegação inferior">
        <div className="grid h-16 grid-cols-5">
          {mobilePrimary.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground")}><Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} /><span className="max-w-full truncate px-1">{item.label === "Visão geral" ? "Início" : item.label}</span></Link>;
          })}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild><button className={cn("flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-medium", navItems.slice(4).some((item) => isActive(pathname, item.href)) ? "text-primary" : "text-muted-foreground")}><MoreHorizontal className="size-5" /><span>Mais</span></button></SheetTrigger>
            <SheetContent side="bottom" className="pb-[calc(1.25rem+var(--safe-area-inset-bottom))]">
              <SheetHeader><SheetTitle>Mais opções</SheetTitle><SheetDescription>Gestão da equipe, financeiro e configurações.</SheetDescription></SheetHeader>
              <div className="space-y-1">
                {navItems.slice(4).map((item) => <NavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setMoreOpen(false)} />)}
                <Link href={`/b/${slug}`} target="_blank" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><ExternalLink className="size-[18px]" />Página pública</Link>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4"><ThemeToggle /><LogoutButton /></div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
