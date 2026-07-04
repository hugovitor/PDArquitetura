import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EbookPopup from "@/components/EbookPopup";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { Analytics } from '@vercel/analytics/react';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Palloma Duarte Arquitetura | Arquitetura de Alto Padrão",
  description: "Projetos sofisticados, funcionais e personalizados. Arquitetura residencial, comercial, clínica e de interiores de luxo.",
  keywords: "arquitetura de interiores, arquiteto porto alegre, porto alegre, arquitetura de luxo, reforma de luxo, projeto residencial, decoração de interiores",
  authors: [{ name: "Palloma Duarte" }],
  openGraph: {
    title: "Palloma Duarte Arquitetura | Projetos de Alto Padrão",
    description: "Espaços sofisticados e exclusivos. Transforme seu lar ou negócio com projetos personalizados de arquitetura e design de interiores.",
    type: "website",
    locale: "pt_BR",
  },
  verification: {
    google: "nq1zuKd3DIaYrtG0vLG00Ye3pqfKqDQYSPqWxsXlYLk",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <Header />
        <main style={{ flex: 1, marginTop: '90px' }}>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <EbookPopup />
        <ExitIntentPopup />
        <Analytics />
      </body>
    </html>
  );
}

