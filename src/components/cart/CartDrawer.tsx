"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CartDrawer() {
  const isOpen = useCartStore(state => state.isOpen);
  const closeCart = useCartStore(state => state.closeCart);
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getTotal = useCartStore(state => state.getTotal);
  const router = useRouter();
  const supabase = createClient();

  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getTotal();
  const total = subtotal + (selectedShipping?.price || 0);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
    if (value.length > 8) value = value.slice(0, 8); // Limita a 8 dígitos
    
    // Aplica a máscara 00000-000
    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    setCep(value);
  };

  const handleCalculateShipping = async () => {
    const rawCep = cep.replace(/\D/g, "");
    if (rawCep.length !== 8) return;
    setIsLoadingShipping(true);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep, items }),
      });
      const data = await res.json();
      if (data.options) {
        setShippingOptions(data.options);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingShipping(false);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    closeCart();
    
    // Podemos passar os dados de frete via query params ou sessionStorage
    // Para simplificar, vamos salvar no sessionStorage para a página de checkout recuperar
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('gc_checkout_shipping', JSON.stringify(selectedShipping));
      sessionStorage.setItem('gc_checkout_cep', cep);
    }
    
    router.push("/checkout");
  };

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("cart") === "true") {
        useCartStore.getState().openCart();
        // Remove param from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

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
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col text-neutral-900"
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
                  <Button variant="outline" onClick={closeCart} className="mt-4 border-neutral-200 text-neutral-900 hover:bg-neutral-100">
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
              <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
                
                {/* Shipping Calculator */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Calcular Frete</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="00000-000" 
                      value={cep}
                      onChange={handleCepChange}
                      className="flex-1 px-3 py-2 border border-neutral-200 rounded-md text-sm"
                      maxLength={9}
                    />
                    <Button variant="outline" onClick={handleCalculateShipping} disabled={isLoadingShipping} className="border-neutral-200 text-neutral-900 hover:bg-neutral-100">
                      {isLoadingShipping ? "..." : "Calcular"}
                    </Button>
                  </div>
                  
                  {shippingOptions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {shippingOptions.map((opt) => (
                        <label key={opt.id} className="flex items-center justify-between p-2 border border-neutral-200 rounded-md cursor-pointer hover:bg-neutral-50">
                          <div className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name="shipping" 
                              value={opt.id} 
                              onChange={() => setSelectedShipping(opt)}
                              className="accent-black"
                            />
                            <div>
                              <p className="text-sm font-medium">{opt.name}</p>
                              <p className="text-xs text-neutral-500">Até {opt.days} dias úteis</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            R$ {opt.price.toFixed(2).replace('.', ',')}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Subtotal</span>
                    <span className="text-sm font-medium">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {selectedShipping && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">Frete</span>
                      <span className="text-sm font-medium">R$ {selectedShipping.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="uppercase tracking-widest text-sm text-neutral-800 font-bold">Total</span>
                    <span className="text-xl font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 mt-4 bg-black text-white hover:bg-neutral-800" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Redirecionando..." : "Finalizar Compra"}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
