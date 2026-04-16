import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { profileAPI } from '@/services/api';
import { User, Address, Payment, Order, Pet } from '@/types';

interface ProfileState {
  user: User;
  addresses: Address[];
  payments: Payment[];
  orders: any[];
  currentOrders: any[];
  pets: Pet[];
  selectedPetId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Basic Actions
  setUser: (user: any) => void;
  updateUser: (updates: Partial<User>) => void;
  addPet: (pet: Omit<Pet, 'id'>) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  switchPet: (id: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setActiveAddress: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  setOrders: (orders: Order[]) => void;
  clearProfile: () => void;
  
  // Database Sync Actions
  loadProfile: () => Promise<void>;
  syncProfile: () => Promise<void>;
  addPetToDB: (pet: Omit<Pet, 'id'>) => Promise<Pet>;
  updatePetInDB: (id: string, updates: Partial<Pet>) => void;
  deletePetFromDB: (id: string) => void;
  uploadPetPhoto: (petId: string, base64Photo: string) => Promise<string>;
  uploadUserAvatar: (base64Avatar: string) => Promise<void>;
  addAddressToDB: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddressInDB: (id: string, updates: Partial<Address>) => Promise<void>;
  deleteAddressFromDB: (id: string) => Promise<void>;
  addPaymentToDB: (payment: Omit<Payment, 'id'>) => Promise<void>;
  updatePaymentInDB: (id: string, updates: Partial<Payment>) => Promise<void>;
  deletePaymentFromDB: (id: string) => Promise<void>;
}

const initialState = {
  user: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    points: 0,
    rating: 0,
  },
  addresses: [],
  payments: [],
  orders: [],
  pets: [],
  selectedPetId: null,
  isLoading: false,
  error: null,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...initialState,
      currentOrders: [], // Added missing field
      
      setUser: (user) => set({ user }),
      
      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),
      
      addPet: (petData) => {
        const newPet: Pet = {
          ...petData,
          id: Date.now().toString(),
        };
        set((state) => ({
          pets: [...state.pets, newPet],
          selectedPetId: state.selectedPetId || newPet.id,
        }));
      },
      
      updatePet: (id, updates) => set((state) => ({
        pets: state.pets.map((pet) =>
          pet.id === id ? { ...pet, ...updates } : pet
        ),
      })),
      
      deletePet: (id) => set((state) => {
        const newPets = state.pets.filter((pet) => pet.id !== id);
        const newSelectedId = state.selectedPetId === id 
          ? (newPets[0]?.id || null) 
          : state.selectedPetId;
        return { pets: newPets, selectedPetId: newSelectedId };
      }),
      
      switchPet: (id) => set({ selectedPetId: id }),
      
      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: Date.now().toString(),
        };
        set((state) => ({
          addresses: [...state.addresses, newAddress],
        }));
      },
      
      updateAddress: (id, updates) => set((state) => ({
        addresses: state.addresses.map((address) =>
          address.id === id ? { ...address, ...updates } : address
        ),
      })),
      
      deleteAddress: (id) => set((state) => ({
        addresses: state.addresses.filter((address) => address.id !== id),
      })),
      
      setActiveAddress: (id) => set((state) => ({
        addresses: state.addresses.map((address) => ({
          ...address,
          active: address.id === id,
        })),
      })),
      
      addPayment: (paymentData) => {
        const newPayment: Payment = {
          ...paymentData,
          id: Date.now().toString(),
        };
        set((state) => ({
          payments: [...state.payments, newPayment],
        }));
      },
      
      updatePayment: (id, updates) => set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === id ? { ...payment, ...updates } : payment
        ),
      })),
      
      deletePayment: (id) => set((state) => ({
        payments: state.payments.filter((payment) => payment.id !== id),
      })),
      
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders],
      })),
      
      updateOrder: (id, updates) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, ...updates } : order
        ),
      })),
      
      setOrders: (orders) => set({ orders }),
      
      clearProfile: () => set(initialState),
      
      // Database Sync Actions
      loadProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('Loading profile...');
          const token = typeof window !== 'undefined' ? localStorage.getItem('wanya_token') : null;
          console.log('Token found:', !!token);
          console.log('Token value:', token?.substring(0, 20) + '...');
          
          // Load profile first
          const profileData = await profileAPI.getProfile();
          console.log('Profile loaded:', profileData);

          set({
            user: profileData.user,
            pets: [],
            addresses: [],
            orders: [],
            payments: [],
            isLoading: false,
            error: null,
          });

          // Then load other data
          try {
            console.log('Loading pets...');
            const petsData = await profileAPI.getPets();
            console.log('Pets data loaded:', petsData);
            
            set((state) => ({
              ...state,
              pets: petsData.pets || [],
            }));
            
            console.log('Final pets in state:', petsData.pets || []);
          } catch (petsError) {
            console.error('Error loading pets:', petsError);
            // Keep profile data even if pets fail to load
          }
          
          try {
            const addressesData = await profileAPI.getAddresses();
            const ordersData = await profileAPI.getOrders();
            const paymentsData = await profileAPI.getPayments();

            set((state) => ({
              ...state,
              addresses: addressesData.addresses || [],
              orders: ordersData.orders || [],
              payments: paymentsData.payments || [],
            }));
          } catch (dataError) {
            console.error('Error loading additional data:', dataError);
            // Keep profile data even if other data fails
          }
        } catch (error) {
          console.error('Load profile error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load profile' 
          });
        }
      },
      
      syncProfile: async () => {
        const state = get();
        try {
          await profileAPI.updateProfile(state.user);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to sync profile' });
          throw error;
        }
      },
      
      addPetToDB: async (petData) => {
        set({ isLoading: true, error: null });
        try {
          console.log('addPetToDB called with:', petData);
          
          // Convert dob object to proper format for backend
          const payload: any = { ...petData };
          
          // ALWAYS include DOB as required by backend - use default if invalid
          if (payload.dob && typeof payload.dob === 'object') {
            const { date, month, year } = payload.dob;
            console.log('Original DOB values:', { date, month, year });
            
            // Convert month name to number if needed
            let monthNum = Number(month);
            if (isNaN(monthNum)) {
              const monthMap: { [key: string]: number } = {
                'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
              };
              monthNum = monthMap[month] || 1;
              console.log('Converted month name to number:', month, '->', monthNum);
            }
            
            // Validate and convert to numbers
            const dayNum = Number(date);
            const yearNum = Number(year);
            
            console.log('Final DOB numbers:', { dayNum, monthNum, yearNum });
            
            // Check if values are valid numbers and in reasonable ranges
            if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum) || 
                dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2100) {
              console.warn('Invalid DOB values, using default date');
              // Use a default date instead of deleting
              payload.dob = {
                date: '01',
                month: '01', 
                year: '2020'
              };
            } else {
              // Keep as object for backend validation with proper formatting
              payload.dob = {
                date: dayNum.toString().padStart(2, '0'),
                month: monthNum.toString().padStart(2, '0'),
                year: yearNum.toString()
              };
              console.log('Valid DOB formatted:', payload.dob);
            }
          } else {
            console.warn('No DOB provided, using default');
            // Always provide DOB as required by backend
            payload.dob = {
              date: '01',
              month: '01',
              year: '2020'
            };
          }

          console.log('Final payload before API call:', payload);
          const response = await profileAPI.addPet(payload);
          console.log('Pet creation response:', response);
          
          const newPet = response.pet;

          // Add the server-created pet (with id) to local state
          set((state) => ({
            pets: [...state.pets, newPet],
            selectedPetId: state.selectedPetId || newPet.id,
            isLoading: false,
            error: null,
          }));
          
          console.log('Pet added to local state:', newPet);
          
          return newPet;
        } catch (error) {
          console.error('addPetToDB error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to add pet' 
          });
          throw error;
        }
      },
      
      updatePetInDB: async (id, updates) => {
        console.log('🔧 updatePetInDB called with:', { id, updates });
        try {
          console.log('📡 Calling profileAPI.updatePet...');
          const response = await profileAPI.updatePet(id, updates);
          console.log('✅ API updatePet response:', response);
          
          console.log('🔄 Updating local state...');
          // Use the updated pet from the response if available, otherwise use the updates
          const updatedPetData = response?.pet || updates;
          get().updatePet(id, updatedPetData);
          console.log('✅ Local state updated successfully');
        } catch (error) {
          console.error('❌ updatePetInDB failed:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to update pet' });
          throw error;
        }
      },
      
      deletePetFromDB: async (id) => {
        try {
          await profileAPI.deletePet(id);
          get().deletePet(id);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete pet' });
          throw error;
        }
      },

      uploadPetPhoto: async (petId: string, base64Photo: string) => {
        try {
          // Convert base64 to blob
          const base64Response = await fetch(base64Photo);
          const blob = await base64Response.blob();
          const formData = new FormData();
          formData.append('photo', blob, 'pet-photo.jpg');

          // Upload photo to the pet
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/pets/${petId}/photo`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('wanya_token') : null}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Photo upload failed');
          }

          const photoData = await response.json();
          
          // Update pet with photo URL
          await profileAPI.updatePet(petId, { photo: photoData.photoUrl });
          
          // Update local state
          get().updatePet(petId, { photo: photoData.photoUrl });
          
          return photoData.photoUrl;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to upload pet photo' });
          throw error;
        }
      },

      uploadUserAvatar: async (base64Avatar: string) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/users/avatar`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('wanya_token') : null}`,
            },
            body: JSON.stringify({ avatar: base64Avatar }),
          });

          if (!response.ok) {
            throw new Error('Avatar upload failed');
          }

          const data = await response.json();
          
          // Update local state
          get().updateUser({ avatar: data.avatar });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to upload avatar' });
          throw error;
        }
      },
      
      addAddressToDB: async (addressData) => {
        try {
          const response = await profileAPI.addAddress(addressData);
          const newAddress = response.address;
          get().addAddress(newAddress);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add address' });
          throw error;
        }
      },
      
      updateAddressInDB: async (id, updates) => {
        try {
          await profileAPI.updateAddress(id, updates);
          get().updateAddress(id, updates);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update address' });
          throw error;
        }
      },
      
      deleteAddressFromDB: async (id) => {
        try {
          await profileAPI.deleteAddress(id);
          get().deleteAddress(id);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete address' });
          throw error;
        }
      },
      
      addPaymentToDB: async (paymentData) => {
        try {
          const response = await profileAPI.addPayment(paymentData);
          const newPayment = response.payment;
          get().addPayment(newPayment);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add payment' });
          throw error;
        }
      },
      
      updatePaymentInDB: async (id, updates) => {
        try {
          await profileAPI.updatePayment(id, updates);
          get().updatePayment(id, updates);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update payment' });
          throw error;
        }
      },
      
      deletePaymentFromDB: async (id) => {
        try {
          await profileAPI.deletePayment(id);
          get().deletePayment(id);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete payment' });
          throw error;
        }
      },
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({
        user: state.user,
        addresses: state.addresses,
        payments: state.payments,
        orders: state.orders,
        pets: state.pets,
        selectedPetId: state.selectedPetId,
      }),
    }
  )
);
