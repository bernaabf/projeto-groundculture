import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });

export const metadata: Metadata = {
  metadataBase: new URL('https://groundculture.com.br'),
  title: {
    template: "%s | Ground Culture",
    default: "Ground Culture | Jiu-Jitsu & Submission",
  },
  description: "Ground Culture Store é referência em rashguards e fightwear para quem vive o Jiu-Jitsu No-Gi e outras artes marciais.",
  openGraph: {
    title: "Ground Culture | Jiu-Jitsu & Submission",
    description: "Ground Culture Store é referência em rashguards e fightwear para quem vive o Jiu-Jitsu No-Gi.",
    url: 'https://groundculture.com.br',
    siteName: 'Ground Culture',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Ground Culture',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ground Culture',
    description: "Referência em rashguards e fightwear para quem vive o Jiu-Jitsu No-Gi.",
    images: ['/images/hero-bg.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ground Culture",
    url: "https://groundculture.com.br",
    logo: "https://groundculture.com.br/images/hero-bg.jpg",
    sameAs: [
      "https://instagram.com/groundculture.store"
    ]
  };

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${interTight.variable} font-sans antialiased text-primary bg-bgPrimary`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
