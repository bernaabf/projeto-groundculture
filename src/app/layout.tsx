import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });

export const metadata: Metadata = {
  title: "Ground Culture | Jiu-Jitsu & Submission",
  description: "Ground Culture Store é referência em rashguards e fightwear para quem vive o Jiu-Jitsu No-Gi e outras artes marciais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${interTight.variable} font-sans antialiased text-primary bg-bgPrimary`}>
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
