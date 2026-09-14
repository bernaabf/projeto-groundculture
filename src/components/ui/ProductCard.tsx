"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hoverImage = product.images.length > 1 ? product.images[1] : product.images[0];
  
  // 3D Parallax setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/produto/${product.id}`} className="group block perspective-1000">
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <div className="relative aspect-[4/5] bg-bgTertiary overflow-hidden mb-6 rounded-none lg:rounded-md border border-borderLight shadow-2xl transition-all duration-300">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 ease-in-out group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Hover Image */}
          <Image
            src={hoverImage}
            alt={`${product.name} Hover`}
            fill
            className="object-cover transition-all duration-700 ease-in-out opacity-0 group-hover:scale-105 group-hover:opacity-100 absolute inset-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm border border-white/10">
            Novo
          </div>
        </div>
      </motion.div>
      
      <div className="flex flex-col gap-1 mt-6 border-t border-borderLight pt-4">
        <h3 className="font-display font-medium text-2xl leading-tight text-white transition-colors">
          {product.name}
        </h3>
        <p className="font-medium text-white/50 text-sm">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </Link>
  );
}
