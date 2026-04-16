"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type SearchState = {
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
};

type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<SearchState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SUGGESTIONS'; payload: string[] }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'ADD_RECENT_SEARCH'; payload: string }
  | { type: 'REMOVE_RECENT_SEARCH'; payload: string };

const initialState: SearchState = {
  query: '',
  filters: {},
  suggestions: [],
  recentSearches: [],
  isSearching: false,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload } 
      };
    
    case 'CLEAR_FILTERS':
      return { ...state, filters: {} };
    
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    
    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload };
    
    case 'CLEAR_SEARCH':
      return { 
        ...state, 
        query: '', 
        filters: {}, 
        suggestions: [], 
        isSearching: false 
      };
    
    case 'ADD_RECENT_SEARCH':
      return {
        ...state,
        recentSearches: [action.payload, ...state.recentSearches.filter(s => s !== action.payload)].slice(0, 10)
      };
    
    case 'REMOVE_RECENT_SEARCH':
      return {
        ...state,
        recentSearches: state.recentSearches.filter(s => s !== action.payload)
      };
    
    default:
      return state;
  }
}

const SearchContext = createContext<{
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
} | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

// Export convenience functions that match the old Zustand interface
export function useSearchStore() {
  const { state, dispatch } = useSearch();
  
  return {
    query: state.query,
    filters: state.filters,
    suggestions: state.suggestions,
    recentSearches: state.recentSearches,
    isSearching: state.isSearching,
    
    setQuery: (query: string) => dispatch({ type: 'SET_QUERY', payload: query }),
    setFilters: (filters: Partial<SearchState['filters']>) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    clearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
    setSuggestions: (suggestions: string[]) => dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions }),
    setSearching: (isSearching: boolean) => dispatch({ type: 'SET_SEARCHING', payload: isSearching }),
    clearSearch: () => dispatch({ type: 'CLEAR_SEARCH' }),
    addRecentSearch: (search: string) => dispatch({ type: 'ADD_RECENT_SEARCH', payload: search }),
    removeRecentSearch: (search: string) => dispatch({ type: 'REMOVE_RECENT_SEARCH', payload: search }),
  };
}
