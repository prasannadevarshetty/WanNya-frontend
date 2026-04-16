"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type User = {
  name: string;
  email: string;
  avatar?: string;
  points: number;
  rating: number;
};

type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  active?: boolean;
};

type Payment = {
  id: string;
  brand: string;
  last4?: string;
  active?: boolean;
};

type Order = {
  id: string;
  title: string;
  category: "shop" | "booking" | "bento";
  price: number;
  date: string;
  status: "completed" | "ongoing" | "cancelled";
};

type Pet = {
  id: string;
  name: string;
  breed: string;
  type: "dog" | "cat";
  gender: "M" | "F" | null;
  dob: {
    date: string;
    month: string;
    year: string;
  };
  allergies: string[];
  sensitivities: string[];
  photo?: string | null;
};

export type { User, Address, Payment, Order, Pet };

type ProfileState = {
  user: User;
  addresses: Address[];
  payments: Payment[];
  orders: Order[];
  pets: Pet[];
  selectedPetId: string | null;
};

type ProfileAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_PET'; payload: Pet }
  | { type: 'SWITCH_PET'; payload?: string }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: { id: string; data: Partial<Address> } }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; data: Partial<Payment> } }
  | { type: 'SET_ACTIVE_ADDRESS'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'LOAD_PROFILE_DATA'; payload: Partial<ProfileState> }
  | { type: 'LOGOUT' };

const initialState: ProfileState = {
  user: {
    name: "",
    email: "",
    avatar: "",
    points: 2500,
    rating: 5,
  },
  addresses: [
    {
      id: "home",
      label: "Home Address",
      street: "Shibuya Crossing",
      city: "Tokyo",
      state: "Tokyo",
      country: "Japan",
      zip: "150-0002",
      active: true,
    },
  ],
  payments: [
    {
      id: "visa",
      brand: "Visa",
      last4: "4111",
      active: true,
    },
  ],
  orders: [],
  pets: [],
  selectedPetId: null,
};

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    
    case 'ADD_PET':
      return {
        ...state,
        pets: [...state.pets, action.payload],
        selectedPetId: action.payload.id,
      };
    
    case 'SWITCH_PET':
      if (state.pets.length <= 1) return state;
      const targetPetId = action.payload;
      if (targetPetId) {
        return {
          ...state,
          selectedPetId: targetPetId,
        };
      } else {
        const currentIndex = state.pets.findIndex(p => p.id === state.selectedPetId);
        const nextIndex = (currentIndex + 1) % state.pets.length;
        return {
          ...state,
          selectedPetId: state.pets[nextIndex].id,
        };
      }
    
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, { ...action.payload, id: crypto.randomUUID() }],
      };
    
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.data } : a
        ),
      };
    
    case 'ADD_PAYMENT':
      return {
        ...state,
        payments: [...state.payments, action.payload],
      };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      };
    
    case 'SET_ACTIVE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(a => ({
          ...a,
          active: a.id === action.payload,
        })),
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    
    case 'LOAD_PROFILE_DATA':
      return {
        ...state,
        ...action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: { name: "", email: "", avatar: "", points: 0, rating: 0 },
        pets: [],
        selectedPetId: null,
      };
    
    default:
      return state;
  }
}

const ProfileContext = createContext<{
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
} | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const { state: authState } = useAuth();

  // Load profile data from localStorage on mount
  useEffect(() => {
    const storedProfileData = localStorage.getItem('wanya_profile_data');
    if (storedProfileData) {
      try {
        const profileData = JSON.parse(storedProfileData);
        // Load profile-specific data (not user data which comes from AuthContext)
        dispatch({ 
          type: 'LOAD_PROFILE_DATA', 
          payload: {
            addresses: profileData.addresses || [],
            payments: profileData.payments || [],
            orders: profileData.orders || [],
            pets: profileData.pets || [],
            selectedPetId: profileData.selectedPetId || null,
          }
        });
      } catch (error) {
        console.error('Error parsing stored profile data:', error);
      }
    }
  }, []);

  // Save profile data to localStorage when it changes (except user which is handled by AuthContext)
  useEffect(() => {
    const dataToSave = {
      addresses: state.addresses,
      payments: state.payments,
      orders: state.orders,
      pets: state.pets,
      selectedPetId: state.selectedPetId,
    };
    localStorage.setItem('wanya_profile_data', JSON.stringify(dataToSave));
  }, [state.addresses, state.payments, state.orders, state.pets, state.selectedPetId]);

  // Sync user data from auth context
  useEffect(() => {
    if (authState.user) {
      dispatch({ 
        type: 'SET_USER', 
        payload: {
          name: authState.user.name,
          email: authState.user.email,
          avatar: authState.user.avatar || '',
          points: authState.user.points || 0,
          rating: authState.user.rating || 0,
        }
      });
    } else {
      dispatch({ type: 'LOGOUT' });
      // Clear profile data on logout
      localStorage.removeItem('wanya_profile_data');
    }
  }, [authState.user]);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

// Export convenience functions that match the old Zustand interface
export function useProfileStore() {
  const { state, dispatch } = useProfile();
  
  return {
    user: state.user,
    addresses: state.addresses,
    payments: state.payments,
    orders: state.orders,
    pets: state.pets,
    selectedPetId: state.selectedPetId,
    
    setUser: (user: User) => dispatch({ type: 'SET_USER', payload: user }),
    updateUser: (data: Partial<User>) => dispatch({ type: 'UPDATE_USER', payload: data }),
    addPet: (pet: Pet) => dispatch({ type: 'ADD_PET', payload: pet }),
    switchPet: (petId?: string) => dispatch({ type: 'SWITCH_PET', payload: petId }),
    addAddress: (address: Address) => dispatch({ type: 'ADD_ADDRESS', payload: address }),
    updateAddress: (id: string, data: Partial<Address>) => dispatch({ type: 'UPDATE_ADDRESS', payload: { id, data } }),
    addPayment: (payment: Payment) => dispatch({ type: 'ADD_PAYMENT', payload: payment }),
    updatePayment: (id: string, data: Partial<Payment>) => dispatch({ type: 'UPDATE_PAYMENT', payload: { id, data } }),
    setActiveAddress: (id: string) => dispatch({ type: 'SET_ACTIVE_ADDRESS', payload: id }),
    addOrder: (order: Order) => dispatch({ type: 'ADD_ORDER', payload: order }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  };
}
