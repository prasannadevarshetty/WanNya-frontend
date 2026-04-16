import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  addedAt: Date;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
  
  // Actions
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) return state;
        
        return {
          items: [...state.items, { ...item, addedAt: new Date() }],
          itemCount: state.itemCount + 1,
        };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        itemCount: Math.max(0, state.itemCount - 1),
      })),
      
      clearWishlist: () => set({ items: [], itemCount: 0 }),
      
      toggleItem: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        
        if (exists) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },
      
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// itemCount is computed from items length
export const useWishlistCount = () => {
  return useWishlistStore((state) => state.items.length);
};
