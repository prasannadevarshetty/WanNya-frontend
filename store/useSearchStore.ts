import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  query: string;
  filters: {
    category?: string;
    priceRange?: [number, number];
    rating?: number;
    inStock?: boolean;
  };
  suggestions: string[];
  recentSearches: string[];
  isSearching: boolean;
  sortOption: "relevance" | "price_low" | "price_high";
  
  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchState['filters']>) => void;
  clearFilters: () => void;
  setSuggestions: (suggestions: string[]) => void;
  setSearching: (isSearching: boolean) => void;
  clearSearch: () => void;
  addRecentSearch: (search: string) => void;
  removeRecentSearch: (search: string) => void;
  setSortOption: (option: "relevance" | "price_low" | "price_high") => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      filters: {},
      suggestions: [],
      recentSearches: [],
      isSearching: false,
      sortOption: "relevance",
      
      setQuery: (query) => set({ query }),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
      
      clearFilters: () => set({ filters: {} }),
      
      setSuggestions: (suggestions) => set({ suggestions }),
      
      setSearching: (isSearching) => set({ isSearching }),
      
      clearSearch: () => set({ 
        query: '', 
        filters: {}, 
        suggestions: [], 
        isSearching: false,
        sortOption: "relevance"
      }),
      
      addRecentSearch: (search) => set((state) => {
        const filtered = state.recentSearches.filter((s) => s !== search);
        return {
          recentSearches: [search, ...filtered].slice(0, 10),
        };
      }),
      
      removeRecentSearch: (search) => set((state) => ({
        recentSearches: state.recentSearches.filter((s) => s !== search),
      })),

      setSortOption: (sortOption) => set({ sortOption }),
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
      }),
    }
  )
);
