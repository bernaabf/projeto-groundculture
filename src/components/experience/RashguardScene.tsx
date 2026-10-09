"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { JiuJitsuBelt } from "./JiuJitsuBelt";
import { MotionValue } from "framer-motion";

export function RashguardScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // Cores das faixas de Jiu-Jitsu (Branca, Azul, Roxa, Marrom, Preta)
  const beltColors = useMemo(() => [
    new THREE.Color("#f0f0f0"), // Branca
    new THREE.Color("#1e3a8a"), // Azul
    new THREE.Color("#581c87"), // Roxa
    new THREE.Color("#451a03"), // Marrom
    new THREE.Color("#0a0a0a")  // Preta
  ], []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
      <spotLight position={[-5, 5, -5]} intensity={1.5} color="#ffffff" />
      <Environment preset="studio" />
      
      {/* Fallback caso a textura demore a carregar */}
      <Suspense fallback={null}>
        <JiuJitsuBelt scrollProgress={scrollProgress} colors={beltColors} />
      </Suspense>

      <ContactShadows 
        position={[0, -3.5, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={10} 
      />
    </>
  );
}
