"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/useCartStore";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/Button";

export default function Header() {
  const openCart = useCartStore(state => state.openCart);
  const items = useCartStore(state => state.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Produtos", href: "/produtos" },
    { name: "Editorial", href: "/sobre" },
    { name: "Contato", href: "/contato" },
    { name: "Login", href: "/login" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-4 inset-x-4 z-50 flex justify-center pointer-events-none"
        )}
      >
        <motion.div 
          layout
          className={cn(
            "px-6 py-3 flex items-center justify-between rounded-full transition-colors duration-500 pointer-events-auto",
            isScrolled ? "bg-bgSecondary/80 backdrop-blur-xl border border-white/10 shadow-2xl w-full max-w-4xl" : "bg-transparent w-full",
            "text-white"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-display font-medium tracking-tight shrink-0 flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-full transition-colors bg-white" />
            <span className={cn("transition-all duration-300 origin-left hidden sm:block", isScrolled && "scale-90")}>
              Ground Culture
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-white/10 hover:text-white text-white/70"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative text-sm font-medium px-4 py-2 rounded-full transition-colors flex items-center gap-2 hover:bg-white/10 text-white/70 hover:text-white"
            >
              Carrinho
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <Link href="/produtos" className="hidden lg:block">
              <Button size="sm" variant="outline" className="border-white/20 hover:bg-white hover:text-black">Explorar</Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-white/10"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </motion.header>

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
                aria-label="Fechar menu"
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
                    onClick={() => setMobileMenuOpen(false)}
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
