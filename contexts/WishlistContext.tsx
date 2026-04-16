"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  addedAt: Date;
};

type WishlistState = {
  items: WishlistItem[];
  itemCount: number;
};

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Omit<WishlistItem, 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'TOGGLE_ITEM'; payload: Omit<WishlistItem, 'addedAt'> };

const initialState: WishlistState = {
  items: [],
  itemCount: 0,
};

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) return state;
      
      const newItem = { ...action.payload, addedAt: new Date() };
      return {
        ...state,
        items: [...state.items, newItem],
        itemCount: state.items.length + 1,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length,
      };
    }
    
    case 'CLEAR_WISHLIST':
      return { items: [], itemCount: 0 };
    
    case 'TOGGLE_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        // Remove if exists
        const newItems = state.items.filter(item => item.id !== action.payload.id);
        return {
          ...state,
          items: newItems,
          itemCount: newItems.length,
        };
      } else {
        // Add if doesn't exist
        const newItem = { ...action.payload, addedAt: new Date() };
        return {
          ...state,
          items: [...state.items, newItem],
          itemCount: state.items.length + 1,
        };
      }
    }
    
    default:
      return state;
  }
}

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
} | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

// Export convenience functions that match the old Zustand interface
export function useWishlistStore() {
  const { state, dispatch } = useWishlist();
  
  return {
    items: state.items,
    itemCount: state.itemCount,
    
    addItem: (item: Omit<WishlistItem, 'addedAt'>) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    clearWishlist: () => dispatch({ type: 'CLEAR_WISHLIST' }),
    toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => dispatch({ type: 'TOGGLE_ITEM', payload: item }),
    isInWishlist: (id: string) => state.items.some(item => item.id === id),
  };
}
