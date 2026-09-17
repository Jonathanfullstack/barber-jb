import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PainelAuthProvider } from "@/context/PainelAuthContext";
import { ClienteAuthProvider } from "@/context/ClienteAuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "JB Barber — Gestão e agendamento para barbearias",
  description: "Crie sua página de agendamento e gerencie equipe, serviços e clientes.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "JB Barber" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#0e0f10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark touch-manipulation" suppressHydrationWarning>
      <body className="flex min-h-screen min-h-[100dvh] flex-col bg-background text-foreground antialiased">
        <PainelAuthProvider>
          <ClienteAuthProvider>
            <Header />
            <div className="flex-1 w-full overflow-x-hidden">{children}</div>
            <Footer />
            <BottomNav />
          </ClienteAuthProvider>
        </PainelAuthProvider>
      </body>
    </html>
  );
}
