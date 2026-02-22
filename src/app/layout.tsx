import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PainelAuthProvider } from "@/context/PainelAuthContext";
import { ClienteAuthProvider } from "@/context/ClienteAuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "JB Barber - Agende nos melhores",
  description: "Sistema de agendamento para barbearias",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "JB Barber" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="touch-manipulation">
      <body className="min-h-screen min-h-[100dvh] flex flex-col bg-gray-900 text-gray-100 antialiased safe-area">
        <PainelAuthProvider>
          <ClienteAuthProvider>
            <Header />
            <main className="flex-1 w-full overflow-x-hidden pb-20 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </ClienteAuthProvider>
        </PainelAuthProvider>
      </body>
    </html>
  );
}
