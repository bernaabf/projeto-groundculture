"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

interface JiuJitsuBeltProps {
  scrollProgress: MotionValue<number>;
  colors: THREE.Color[];
}

export function JiuJitsuBelt({ scrollProgress, colors }: JiuJitsuBeltProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Refs para os materiais (para espelhar a cor base do scroll em todas as partes da faixa)
  const materialKnotRef = useRef<THREE.MeshStandardMaterial>(null);
  const materialTail1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const materialTail2Ref = useRef<THREE.MeshStandardMaterial>(null);

  // Refs para o pivô das pontas (simulando gravidade e caimento do tecido)
  const tail1Ref = useRef<THREE.Group>(null);
  const tail2Ref = useRef<THREE.Group>(null);

  // Textura procedural de tecido (Bump Map) gerada via Canvas API
  const [fabricBumpMap, setFabricBumpMap] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Cor base neutra para o Bump Map (nível do mar)
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 512, 512);

      // 1. Ruído para simular a trama do algodão espesso
      for (let i = 0; i < 40000; i++) {
        const intensity = Math.random() * 60 - 30;
        ctx.fillStyle = `rgb(${128 + intensity}, ${128 + intensity}, ${128 + intensity})`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
      }

      // 2. Costuras longitudinais típicas de Faixa de Jiu-Jitsu
      // A faixa real tem de 6 a 8 linhas de costura fortes de ponta a ponta
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ffffff"; // Branco representa relevo alto no bump map
      for (let x = 20; x < 512; x += 55) {
        ctx.beginPath();
        for (let y = 0; y <= 512; y += 15) {
          // Adiciona uma leve variação (zig-zag natural da costura)
          ctx.lineTo(x + (Math.random() * 2 - 1), y);
        }
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      // Repetição para garantir que a textura não fique esticada
      texture.repeat.set(2, 6); 
      setFabricBumpMap(texture);
    }
  }, []);
  
  useFrame((state) => {
    if (!groupRef.current || !materialKnotRef.current) return;
    
    const offset = scrollProgress.get();
    const t = state.clock.getElapsedTime();
    
    // 1. Evolução da cor
    const colorProgress = Math.min(Math.max((offset / 0.8) * 4, 0), 4);
    const idx1 = Math.floor(colorProgress);
    const idx2 = Math.min(idx1 + 1, 4);
    const lerpFactor = colorProgress - idx1;
    
    const currentColor = colors[idx1].clone().lerp(colors[idx2], lerpFactor);
    
    // Aplica a cor
    materialKnotRef.current.color.copy(currentColor);
    if(materialTail1Ref.current) materialTail1Ref.current.color.copy(currentColor);
    if(materialTail2Ref.current) materialTail2Ref.current.color.copy(currentColor);
    
    // 2. Movimento Base
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.15;
    
    // 3. Rotação Majestosa
    groupRef.current.rotation.y = offset * Math.PI * 4;
    groupRef.current.rotation.x = 0.1 + Math.sin(offset * Math.PI) * 0.15;
    
    // 4. Pêndulos de tecido
    if (tail1Ref.current && tail2Ref.current) {
       tail1Ref.current.rotation.x = Math.sin(t * 1.8) * 0.08;
       tail2Ref.current.rotation.x = Math.cos(t * 1.6) * 0.10;
       tail1Ref.current.rotation.z = -0.05 + Math.sin(t * 1.2) * 0.03;
       tail2Ref.current.rotation.z = 0.05 + Math.cos(t * 1.3) * 0.03;
    }

    // Zoom-in
    groupRef.current.position.z = Math.sin(offset * Math.PI) * 1.5;
    groupRef.current.position.y += Math.sin(offset * Math.PI) * 0.5;
  });

  // Material Base de Tecido Reutilizado
  const fabricMaterialProps = {
    roughness: 1.0, // Tecido não tem brilho (totalmente fosco)
    metalness: 0.0,
    bumpMap: fabricBumpMap || undefined,
    bumpScale: 0.03, // Intensidade do relevo da textura
  };

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* 1. O Nó Central */}
      <mesh position={[0, 0, 0]} scale={[1.5, 1.2, 0.4]} castShadow receiveShadow>
        <torusKnotGeometry args={[0.5, 0.25, 128, 32, 2, 3]} />
        <meshStandardMaterial ref={materialKnotRef} {...fabricMaterialProps} />
      </mesh>

      {/* 2. Ponta solta Direita */}
      <group ref={tail1Ref} position={[0.4, -0.6, 0.1]}>
        <mesh position={[0, -2, 0]} rotation={[0, 0, -0.02]} scale={[1, 1, 0.12]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 4, 32]} />
          <meshStandardMaterial ref={materialTail1Ref} {...fabricMaterialProps} />
        </mesh>
      </group>

      {/* 3. Ponta solta Esquerda */}
      <group ref={tail2Ref} position={[-0.4, -0.6, -0.1]}>
        <mesh position={[0, -2.2, 0]} rotation={[0, 0, 0.02]} scale={[1, 1, 0.12]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 4.4, 32]} />
          <meshStandardMaterial ref={materialTail2Ref} {...fabricMaterialProps} />
          
          {/* Tarja preta e grau */}
          <mesh position={[0, -1.6, 0]}>
             <cylinderGeometry args={[0.23, 0.23, 0.8, 32]} />
             {/* A tarja preta também recebe uma textura, mas menor */}
             <meshStandardMaterial color="#111111" roughness={0.9} bumpMap={fabricBumpMap || undefined} bumpScale={0.01} />
             
             <mesh position={[0, -0.2, 0]}>
               <cylinderGeometry args={[0.24, 0.24, 0.15, 32]} />
               <meshStandardMaterial color="#cc0000" roughness={0.9} />
             </mesh>
          </mesh>
        </mesh>
      </group>
    </group>
  );
}
