"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { storeData } from "@/lib/data";
import { LetteringText } from "@/components/ui/LetteringText";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const featuredProducts = storeData.products.slice(0, 3); // showing 3 for grid symmetry

  return (
    <div className="bg-bgPrimary text-white font-sans">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-bgPrimary"
      >
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: y1, opacity }} className="absolute inset-0 w-full h-full">
            <Image
              src="/images/hero-banner.jpg"
              alt="Ground Culture Rashguard"
              fill
              sizes="100vw"
              quality={90}
              className="object-cover object-center opacity-70"
              priority
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-bgPrimary/50 to-bgPrimary/20" />
          </motion.div>
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 w-full text-center flex flex-col items-center">
          <div className="max-w-5xl mx-auto">
            <LetteringText 
              text="Premium Fightwear"
              className="text-5xl md:text-8xl lg:text-[9rem] font-display font-medium tracking-tighter leading-[0.9] text-white justify-center"
            />
            
            <div className="mt-12 flex flex-col items-center gap-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-xl md:text-2xl font-light text-white/80 max-w-2xl mx-auto text-balance"
              >
                Equipamentos de alta performance para quem respira Jiu-Jitsu e Submission. Desenvolvidos para suportar as batalhas mais duras no tatame.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex gap-4"
              >
                <Link href="/produtos">
                  <Button size="lg" variant="primary" className="bg-white text-bgPrimary hover:bg-white/90 gap-2">
                    Explorar Coleção
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features Layout (Inspired by Vita Travels) */}
      <section className="py-24 border-t border-borderPrimary bg-bgPrimary overflow-hidden">
        <AnimatedSection className="container mx-auto px-6 lg:px-12">
          
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight">Categorias</h2>
            <div className="text-sm font-bold uppercase tracking-widest text-white/40 hidden md:block">/ Explore O Catálogo</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-borderPrimary border border-borderPrimary rounded-xl overflow-hidden">
            {/* Category 1 */}
            <div className="bg-bgPrimary p-8 md:p-12 group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-12">
                <h3 className="font-display font-medium text-3xl">Manga Curta</h3>
                <span className="text-xs uppercase tracking-widest text-white/40 font-bold">/ Coleção</span>
              </div>
              <Link href="/produtos?categoria=Manga%20Curta" className="block relative aspect-square overflow-hidden rounded-md border border-borderLight">
                <Image 
                  src={storeData.products[0].images[0]} 
                  alt="Coleção de Rashguards Manga Curta - Ground Culture" 
                  fill 
                  className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                />
              </Link>
            </div>
            
            {/* Category 2 */}
            <div className="bg-bgPrimary p-8 md:p-12 group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-12">
                <h3 className="font-display font-medium text-3xl">Manga Longa</h3>
                <span className="text-xs uppercase tracking-widest text-white/40 font-bold">/ Coleção</span>
              </div>
              <Link href="/produtos?categoria=Manga%20Longa" className="block relative aspect-square overflow-hidden rounded-md border border-borderLight">
                <Image 
                  src={storeData.products.find(p => p.category === "Manga Longa")?.images[0] || ""} 
                  alt="Coleção de Rashguards Manga Longa - Ground Culture" 
                  fill 
                  className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Products */}
      <section className="py-24 border-t border-borderPrimary overflow-hidden">
        <AnimatedSection className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">Destaques</h2>
              <p className="text-white/60 font-light leading-relaxed text-lg">
                Descubra rashguards exclusivas e materiais de nível especialista criados para inspirar sua performance nos tatames.
              </p>
            </div>
            <Link href="/produtos" className="hidden md:inline-flex">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
                Ver Todos
              </Button>
            </Link>
          </div>
          
          {/* Using 3 items to show large grid sizes like the reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/produtos">
                <Button variant="outline" className="w-full border-white/20">Ver Todos</Button>
             </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Editorial Manifesto */}
      <section className="py-40 bg-bgSecondary border-t border-borderPrimary relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Imagem de Cultura (Segunda Foto) */}
            <div className="md:col-span-5 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10"
              >
                <Image 
                  src="/images/camo-rashguard.jpg" 
                  alt="Ground Culture Camo Rashguard Lifestyle" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Texto de Cultura */}
            <div className="md:col-span-7 order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium tracking-tighter leading-[1.05] mb-8">
                  A verdadeira essência <br className="hidden md:block" /> da cultura No-Gi.
                </h2>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-12"
              >
                Nossa marca nasceu no tatame. Combinamos estética impecável com durabilidade extrema. Cada rashguard é construída para ser sua segunda pele, te dando o suporte e a confiança que você exige. <strong className="text-white font-medium">Vista a sua armadura.</strong>
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex gap-12 lg:gap-16"
              >
                <div>
                  <div className="text-4xl lg:text-5xl font-display font-medium">Design</div>
                  <div className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white/40 mt-2">Exclusivo & Minimalista</div>
                </div>
                <div>
                  <div className="text-4xl lg:text-5xl font-display font-medium">Performance</div>
                  <div className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white/40 mt-2">Materiais Premium</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
