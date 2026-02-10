import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { Toaster } from "sonner";
import { QueryClientContext } from "@/providers/queryclient";
import { AosInit } from "./(public)/_components/aos-init";
import NextTopLoader from 'nextjs-toploader'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgendaPRO - Encontre os melhores profissionais em um único local!",
  description:
    "Somos uma plataforma dedicada a diversos segmentos, com o objetivo de agilizar o atendimento de forma simples, organizada e eficiente.",
  keywords: [
    "agendamento online",
    "gestão de negócios",
    "SaaS para serviços",
    "plataforma de agendamento",
    "sistema de gestão",
    "software para empresas de serviços",
    "agenda online",
    "gestão de clientes",
    "plataforma de profissionais",
    "sistema de reservas",
  ],
  authors: [{ name: "AgendaPRO" }],
  creator: "AgendaPRO",
  publisher: "AgendaPRO",
  applicationName: "AgendaPRO",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "AgendaPRO - Encontre os melhores profissionais em um único local!",
    description:
      "Somos uma plataforma dedicada a diversos segmentos, com o objetivo de agilizar o atendimento de forma simples, organizada e eficiente.",
    images: [`${process.env.NEXT_PUBLIC_URL}/logoAgendaPRO.png`],
    url: `${process.env.NEXT_PUBLIC_URL}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgendaPRO - Encontre os melhores profissionais em um único local!",
    description:
      "Somos uma plataforma dedicada a diversos segmentos, com o objetivo de agilizar o atendimento de forma simples, organizada e eficiente.",
    images: [`${process.env.NEXT_PUBLIC_URL}/logoAgendaPRO.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="overflow-x-hidden">
      <body
        className={`overflow-x-hidden ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          <QueryClientContext>
            <NextTopLoader 
              color="#07db4a" 
              height={6} 
              showSpinner={false} 
            />
            <Toaster duration={2500} />
            {children}
            <AosInit />
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
