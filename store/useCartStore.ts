import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI } from '@/services/api';

export interface CartItem {
  id: string;
  name: string;
  title: string; // For display purposes
  price: number;
  quantity: number;
  image: string;
  category?: string;
  duration?: string; // For services/bookings
  rating?: number; // Product rating
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  
  // Basic Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  
  // Database Sync Actions
  loadCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  addItemToDB: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  updateItemInDB: (id: string, quantity: number) => Promise<void>;
  removeItemFromDB: (id: string) => Promise<void>;
  clearCartFromDB: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,
      error: null,
      
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        
        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
        }
      },
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          }));
        }
      },
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      clearCart: () => set({ items: [] }),
      
      // Database Sync Actions
      loadCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const cartData = await cartAPI.getCart();
          set({
            items: cartData.items || [],
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load cart' 
          });
        }
      },
      
      syncCart: async () => {
        const state = get();
        try {
          // Clear existing cart in DB and re-add all items
          await cartAPI.clearCart();
          for (const item of state.items) {
            await cartAPI.addItem(item);
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to sync cart' });
        }
      },
      
      addItemToDB: async (item) => {
        set({ isLoading: true, error: null });
        try {
          await cartAPI.addItem(item);
          // Add to local state after successful DB operation
          get().addItem(item);
          set({ isLoading: false, error: null });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to add item to cart' 
          });
        }
      },
      
      updateItemInDB: async (id, quantity) => {
        try {
          await cartAPI.updateQuantity(id, quantity);
          get().updateQuantity(id, quantity);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update item' });
        }
      },
      
      removeItemFromDB: async (id) => {
        try {
          await cartAPI.removeItem(id);
          get().removeItem(id);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove item' });
        }
      },
      
      clearCartFromDB: async () => {
        try {
          await cartAPI.clearCart();
          get().clearCart();
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to clear cart' });
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Computed values - update totals whenever items change
export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  
  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  
  return { totalItems, totalPrice };
};
