import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PetType = 'dog' | 'cat';
export type Gender = 'M' | 'F' | null;

interface OnboardingState {
  petType: PetType | null;
  petName: string;
  petBreed: string;
  petGender: Gender;
  petBirthDate: {
    date: string;
    month: string;
    year: string;
  };
  petAllergies: string[];
  petSensitivities: string[];
  petAvatar: string | null;
  currentStep: number;
  isCompleted: boolean;
  isEditMode: boolean;
  editingPetId: string | null;
  
  // Actions
  setPetType: (type: PetType) => void;
  setPetName: (name: string) => void;
  setPetBreed: (breed: string) => void;
  setPetGender: (gender: Gender) => void;
  setPetBirthDate: (birthDate: { date: string; month: string; year: string }) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  addSensitivity: (sensitivity: string) => void;
  removeSensitivity: (sensitivity: string) => void;
  setPetAvatar: (avatar: string | null) => void;
  clearPetAvatar: () => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  loadPetForEdit: (pet: any) => void;
  setEditMode: (isEdit: boolean, petId?: string) => void;
}

const initialState = {
  petType: null,
  petName: '',
  petBreed: '',
  petGender: null,
  petBirthDate: {
    date: '',
    month: '',
    year: '',
  },
  petAllergies: [],
  petSensitivities: [],
  petAvatar: null,
  currentStep: 1,
  isCompleted: false,
  isEditMode: false,
  editingPetId: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setPetType: (type) => set({ petType: type }),
      
      setPetName: (name) => set({ petName: name }),
      
      setPetBreed: (breed) => set({ petBreed: breed }),
      
      setPetGender: (gender) => set({ petGender: gender }),
      
      setPetBirthDate: (birthDate) => set({ petBirthDate: birthDate }),
      
      addAllergy: (allergy) => set((state) => ({
        petAllergies: state.petAllergies.includes(allergy)
          ? state.petAllergies
          : [...state.petAllergies, allergy],
      })),
      
      removeAllergy: (allergy) => set((state) => ({
        petAllergies: state.petAllergies.filter((a) => a !== allergy),
      })),
      
      addSensitivity: (sensitivity) => set((state) => ({
        petSensitivities: state.petSensitivities.includes(sensitivity)
          ? state.petSensitivities
          : [...state.petSensitivities, sensitivity],
      })),
      
      removeSensitivity: (sensitivity) => set((state) => ({
        petSensitivities: state.petSensitivities.filter((s) => s !== sensitivity),
      })),
      
      setPetAvatar: (avatar) => set({ petAvatar: avatar }),
      
      clearPetAvatar: () => set({ petAvatar: null }),
      
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 7),
      })),
      
      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1),
      })),
      
      completeOnboarding: () => set({ isCompleted: true }),
      
      resetOnboarding: () => set(initialState),
      
      loadPetForEdit: (pet) => set({
        petType: pet.type,
        petName: pet.name,
        petBreed: pet.breed,
        petGender: pet.gender,
        petBirthDate: pet.dob || { date: '', month: '', year: '' },
        petAllergies: pet.allergies || [],
        petSensitivities: pet.sensitivities || [],
        petAvatar: pet.photo || null,
        isEditMode: true,
        editingPetId: pet.id,
      }),
      
      setEditMode: (isEdit, petId) => set({
        isEditMode: isEdit,
        editingPetId: petId || null,
      }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
