"use client";

import { storeData } from "@/lib/data";
import { useCartStore } from "@/lib/store/useCartStore";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useState, use } from "react";
import { Button } from "@/components/ui/Button";

export default function ProdutoPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const product = storeData.products.find(p => p.id === params.slug);
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  
  if (!product) return notFound();

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError(true);
      return;
    }
    setError(false);
    addItem(product, selectedSize);
  };

  return (
    <div className="bg-bgPrimary text-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Images */}
          <div className="space-y-4 lg:sticky lg:top-32">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-[4/5] relative bg-bgTertiary rounded-xl overflow-hidden shadow-2xl border border-borderLight">
                <Image 
                  src={img}
                  alt={`${product.name} - Imagem ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Product Info (Sticky) */}
          <div className="lg:py-12">
            <div className="mb-10 border-b border-borderPrimary pb-8">
              <h1 className="text-5xl md:text-6xl font-display font-medium tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-2xl text-white/60 font-light">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <div className="space-y-12">
              <div>
                <p className="text-lg text-white/80 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-10 border-t border-borderPrimary pt-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold uppercase tracking-widest text-xs text-white/50">Selecione o Tamanho</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.variants.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setError(false);
                      }}
                      className={`py-4 text-sm font-medium rounded-lg border transition-all ${
                        selectedSize === size
                          ? "border-white bg-white text-black"
                          : "border-borderLight text-white/60 hover:border-white hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {error && (
                  <p className="text-red-400 text-sm mt-3" aria-live="polite">Por favor, selecione um tamanho.</p>
                )}
              </div>

              <Button 
                size="lg" 
                className="w-full mb-4"
                onClick={handleAddToCart}
                variant="accent"
              >
                Adicionar ao Carrinho
              </Button>

              <div className="border-t border-borderPrimary mt-10 pt-8">
                <h4 className="font-bold uppercase tracking-widest text-xs text-white/50 mb-4">Detalhes do Produto</h4>
                <ul className="list-disc pl-4 space-y-2 text-white/70 font-light text-sm">
                  <li>Tecido de combate de alta performance</li>
                  <li>Blend Premium (Poliamida + Elastano)</li>
                  <li>Costura elástica reforçada</li>
                  <li>Proteção UV 50+</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
