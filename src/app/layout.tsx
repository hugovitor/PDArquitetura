import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Analytics } from '@vercel/analytics/react';
import { Suspense } from 'react';
import VisitorTracker from '@/components/VisitorTracker';
import { business, siteName, siteUrl } from '@/lib/site';

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Palloma Duarte Arquitetura | Arquitetura de Alto Padrão em Brasília",
    template: "%s | Palloma Duarte Arquitetura",
  },
  description: business.description,
  keywords: [
    "arquiteta brasília",
    "arquitetura de interiores brasília",
    "reforma de apartamento vicente pires",
    "arquitetura de luxo df",
    "projeto residencial brasília",
    "design de interiores brasília",
    "clínica arquitetura brasília",
  ],
  authors: [{ name: "Palloma Duarte" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Palloma Duarte Arquitetura | Projetos de Alto Padrão em Brasília",
    description: business.description,
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/projects/res-2.png",
        width: 1200,
        height: 800,
        alt: "Projeto de interiores Palloma Duarte Arquitetura em Brasília",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palloma Duarte Arquitetura | Brasília",
    description: business.description,
    images: ["/projects/res-2.png"],
  },
  verification: {
    google: "nq1zuKd3DIaYrtG0vLG00Ye3pqfKqDQYSPqWxsXlYLk",
  }
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: business.name,
  description: business.description,
  url: siteUrl,
  image: `${siteUrl}/projects/res-2.png`,
  telephone: business.telephone,
  email: business.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: business.city,
    addressRegion: business.region,
    addressCountry: "BR",
  },
  areaServed: business.areaServed,
  sameAs: [business.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Header />
        <main style={{ flex: 1, marginTop: '90px' }}>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <Suspense fallback={null}>
          <VisitorTracker />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}

