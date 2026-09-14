"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/useCartStore";
import { Product } from "@/lib/data";

interface AddToCartProps {
  product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
  const addItem = useCartStore(state => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError(true);
      return;
    }
    setError(false);
    addItem(product, selectedSize);
  };

  return (
    <div className="mb-10 border-t border-borderPrimary pt-8">
      <div className="flex justify-between items-center mb-4" id="size-label">
        <span className="font-bold uppercase tracking-widest text-xs text-white/50">Selecione o Tamanho</span>
      </div>
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-labelledby="size-label">
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
            role="radio"
            aria-checked={selectedSize === size}
          >
            {size}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-3" aria-live="polite">Por favor, selecione um tamanho.</p>
      )}

      <Button 
        size="lg" 
        className="w-full mt-8"
        onClick={handleAddToCart}
        variant="accent"
      >
        Adicionar ao Carrinho
      </Button>
    </div>
  );
}
