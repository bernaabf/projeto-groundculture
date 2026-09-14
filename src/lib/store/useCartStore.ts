import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/data';

export interface CartItem {
  product: Product;
  variant: string;
  quantity: number;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variant: string) => void;
  removeItem: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      items: [],
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, variant) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.variant === variant
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.variant === variant
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { product, variant, quantity: 1 }], isOpen: true };
        });
      },
      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variant === variant)
          ),
        }));
      },
      updateQuantity: (productId, variant, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.variant === variant
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'gc-cart-storage',
    }
  )
);
