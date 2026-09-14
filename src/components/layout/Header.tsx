"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/useCartStore";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Header() {
  const { openCart, items } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Produtos", href: "/produtos" },
    { name: "Editorial", href: "/sobre" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-4 inset-x-4 z-50 transition-all duration-500",
        )}
      >
        <div className={cn(
          "container mx-auto px-4 py-3 flex items-center justify-between rounded-2xl transition-all duration-300",
          isScrolled ? "bg-bgSecondary/90 backdrop-blur-md shadow-lg border border-borderPrimary" : "bg-transparent",
          "text-white"
        )}>
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-display font-medium tracking-tight shrink-0 flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-full transition-colors bg-white" />
            Ground Culture
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative text-sm font-medium px-4 py-2 rounded-full transition-colors flex items-center gap-2 hover:bg-white/10"
            >
              Carrinho
              {cartCount > 0 && (
                <span className="bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <Link href="/produtos" className="hidden lg:block">
              <Button size="sm" variant="outline" className="border-white/20 hover:bg-white hover:text-black">Explorar</Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-white/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-bgPrimary text-white lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6">
              <Link href="/" className="text-xl font-display font-medium tracking-tight">
                Ground Culture
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 px-6 pt-12 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={link.href}
                    className="text-4xl font-display font-medium tracking-tight"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
