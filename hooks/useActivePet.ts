// hooks/useActivePet.ts
import { useProfileStore } from "@/store/useProfileStore";

export const useActivePet = () => {
  const { pets, selectedPetId } = useProfileStore();

  return pets.find((p) => p.id === selectedPetId) || pets[0] || null;
};