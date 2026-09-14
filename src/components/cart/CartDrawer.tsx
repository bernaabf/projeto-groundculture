"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useEffect } from "react";

export default function CartDrawer() {
  const isOpen = useCartStore(state => state.isOpen);
  const closeCart = useCartStore(state => state.closeCart);
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getTotal = useCartStore(state => state.getTotal);

  const total = getTotal();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Carrinho
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Fechar carrinho"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-neutral-400">
                  <ShoppingBag className="w-12 h-12 mb-2 opacity-50" />
                  <p className="uppercase tracking-widest text-sm">Seu carrinho está vazio</p>
                  <Button variant="outline" onClick={closeCart} className="mt-4">
                    Continuar comprando
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.product.id}-${item.variant}`} className="flex gap-4">
                    <div className="w-24 h-24 bg-neutral-100 relative overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2 leading-snug">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">Tamanho: {item.variant}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.variant, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 transition-colors"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.variant, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-100 transition-colors"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.variant)}
                          className="text-xs text-neutral-400 hover:text-black uppercase tracking-wider underline underline-offset-2"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm whitespace-nowrap">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="uppercase tracking-widest text-sm text-neutral-500">Subtotal</span>
                  <span className="text-xl font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-xs text-neutral-500 mb-6 text-center">
                  O pagamento e o frete não estão disponíveis nesta versão de demonstração.
                </p>
                <Button className="w-full h-12" size="lg" disabled>
                  Finalizar Compra
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
