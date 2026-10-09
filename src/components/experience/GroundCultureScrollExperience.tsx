"use client";

import { Canvas } from "@react-three/fiber";
import { RashguardScene } from "./RashguardScene";
import { LetteringText } from "@/components/ui/LetteringText";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

export default function GroundCultureScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Captura o progresso real de scroll deste container para passar ao 3D
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    // Altura de 400vh para dar espaço à rolagem
    <section ref={containerRef} className="relative w-full h-[400vh] bg-bgPrimary">
      
      {/* 3D Canvas grudado na tela (sticky) */}
      <div className="sticky top-0 w-full h-screen z-0 overflow-hidden" style={{ background: "#0B0F12" }}>
        <Canvas
          shadows
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 8], fov: 45 }}
          className="w-full h-full"
        >
          <RashguardScene scrollProgress={scrollYProgress} />
        </Canvas>
      </div>
      
      {/* HTML Content (scroll normal do navegador, por cima do Canvas) */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        
        {/* Página 1: Hero */}
        <div className="w-full h-screen flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/40 via-transparent to-bgPrimary/80 z-0" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20 pointer-events-auto">
            <LetteringText 
              text="Premium Fightwear"
              className="text-5xl md:text-8xl lg:text-[9rem] font-display font-medium tracking-tighter leading-[0.9] text-white justify-center drop-shadow-2xl"
            />
            
            <div className="mt-12 flex flex-col items-center gap-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-xl md:text-2xl font-light text-white/80 max-w-2xl mx-auto text-balance drop-shadow-md"
              >
                Equipamentos de alta performance para quem respira Jiu-Jitsu e Submission. Desenvolvidos para suportar as batalhas mais duras no tatame.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link href="/produtos">
                  <Button size="lg" variant="primary" className="bg-white text-bgPrimary hover:bg-white/90 gap-2 pointer-events-auto shadow-xl">
                    Explorar Coleção
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Páginas 2 e 3: Espaço vazio onde a animação 3D toma conta da tela inteira */}
        <div className="w-full h-[200vh]" />
        
        {/* Página 4: Transição de Saída */}
        <div className="w-full h-screen flex flex-col items-center justify-end pb-32 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center pointer-events-auto"
          >
            <p className="uppercase tracking-widest text-white/50 text-sm font-bold mb-4">A Evolução Continua</p>
            <Link href="/produtos">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black shadow-xl">
                Ver Todos os Equipamentos
              </Button>
            </Link>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
