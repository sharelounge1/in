import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);

        if (existingItem) {
          // Update quantity if item already exists
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            ),
          }));
        } else {
          // Add new item
          set((state) => ({
            items: [
              ...state.items,
              { ...item, quantity: item.quantity ?? 1 },
            ],
          }));
        }
      },

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clear: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const optionsPrice = item.options?.reduce(
            (sum, opt) => sum + (opt.additionalPrice ?? 0),
            0
          ) ?? 0;
          return total + (item.price + optionsPrice) * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    { name: 'cart-storage' }
  )
);
