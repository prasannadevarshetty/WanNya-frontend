"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type PetType = 'dog' | 'cat';
export type Gender = 'M' | 'F' | null;

type OnboardingState = {
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
};

type OnboardingAction =
  | { type: 'SET_PET_TYPE'; payload: PetType }
  | { type: 'SET_PET_NAME'; payload: string }
  | { type: 'SET_PET_BREED'; payload: string }
  | { type: 'SET_PET_GENDER'; payload: Gender }
  | { type: 'SET_PET_BIRTH_DATE'; payload: { date: string; month: string; year: string } }
  | { type: 'ADD_ALLERGY'; payload: string }
  | { type: 'REMOVE_ALLERGY'; payload: string }
  | { type: 'ADD_SENSITIVITY'; payload: string }
  | { type: 'REMOVE_SENSITIVITY'; payload: string }
  | { type: 'SET_PET_AVATAR'; payload: string | null }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_ONBOARDING' };

const initialState: OnboardingState = {
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
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_PET_TYPE':
      return { ...state, petType: action.payload };
    
    case 'SET_PET_NAME':
      return { ...state, petName: action.payload };
    
    case 'SET_PET_BREED':
      return { ...state, petBreed: action.payload };
    
    case 'SET_PET_GENDER':
      return { ...state, petGender: action.payload };
    
    case 'SET_PET_BIRTH_DATE':
      return { ...state, petBirthDate: action.payload };
    
    case 'ADD_ALLERGY':
      return {
        ...state,
        petAllergies: state.petAllergies.includes(action.payload)
          ? state.petAllergies
          : [...state.petAllergies, action.payload],
      };
    
    case 'REMOVE_ALLERGY':
      return {
        ...state,
        petAllergies: state.petAllergies.filter(allergy => allergy !== action.payload),
      };
    
    case 'ADD_SENSITIVITY':
      return {
        ...state,
        petSensitivities: state.petSensitivities.includes(action.payload)
          ? state.petSensitivities
          : [...state.petSensitivities, action.payload],
      };
    
    case 'REMOVE_SENSITIVITY':
      return {
        ...state,
        petSensitivities: state.petSensitivities.filter(sensitivity => sensitivity !== action.payload),
      };
    
    case 'SET_PET_AVATAR':
      return { ...state, petAvatar: action.payload };
    
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 7) };
    
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    
    case 'COMPLETE_ONBOARDING':
      return { ...state, isCompleted: true };
    
    case 'RESET_ONBOARDING':
      return initialState;
    
    default:
      return state;
  }
}

const OnboardingContext = createContext<{
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
} | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// Export convenience functions that match the old Zustand interface
export function useOnboardingStore() {
  const { state, dispatch } = useOnboarding();
  
  return {
    petType: state.petType,
    petName: state.petName,
    petBreed: state.petBreed,
    petGender: state.petGender,
    petBirthDate: state.petBirthDate,
    petAllergies: state.petAllergies,
    petSensitivities: state.petSensitivities,
    petAvatar: state.petAvatar,
    currentStep: state.currentStep,
    isCompleted: state.isCompleted,
    
    setPetType: (petType: PetType) => dispatch({ type: 'SET_PET_TYPE', payload: petType }),
    setPetName: (petName: string) => dispatch({ type: 'SET_PET_NAME', payload: petName }),
    setPetBreed: (petBreed: string) => dispatch({ type: 'SET_PET_BREED', payload: petBreed }),
    setPetGender: (petGender: Gender) => dispatch({ type: 'SET_PET_GENDER', payload: petGender }),
    setPetBirthDate: (birthDate: { date: string; month: string; year: string }) => 
      dispatch({ type: 'SET_PET_BIRTH_DATE', payload: birthDate }),
    addAllergy: (allergy: string) => dispatch({ type: 'ADD_ALLERGY', payload: allergy }),
    removeAllergy: (allergy: string) => dispatch({ type: 'REMOVE_ALLERGY', payload: allergy }),
    addSensitivity: (sensitivity: string) => dispatch({ type: 'ADD_SENSITIVITY', payload: sensitivity }),
    removeSensitivity: (sensitivity: string) => dispatch({ type: 'REMOVE_SENSITIVITY', payload: sensitivity }),
    setPetAvatar: (avatar: string | null) => dispatch({ type: 'SET_PET_AVATAR', payload: avatar }),
    clearPetAvatar: () => dispatch({ type: 'SET_PET_AVATAR', payload: null }),
    setStep: (step: number) => dispatch({ type: 'SET_STEP', payload: step }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    completeOnboarding: () => dispatch({ type: 'COMPLETE_ONBOARDING' }),
    resetOnboarding: () => dispatch({ type: 'RESET_ONBOARDING' }),
  };
}
