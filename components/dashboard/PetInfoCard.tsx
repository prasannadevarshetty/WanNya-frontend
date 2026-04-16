"use client";

import { Plus, PawPrint, AlertTriangle, Repeat } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/useProfileStore";
import { useTranslations } from "next-intl";
export default function PetInfoCard() {
  const router = useRouter();
  const t = useTranslations("petinfo");
  const { pets, selectedPetId, switchPet } = useProfileStore();

  const pet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const handleAddPet = () => {
    router.push("/onboarding/step-1");
  };

  const handleSwitchPet = () => {
    if (pets.length <= 1) return;

    const currentIndex = pets.findIndex((p) => p.id === selectedPetId);
    const nextIndex = (currentIndex + 1) % pets.length;
    switchPet(pets[nextIndex].id);
  };

  return (
    <div className="relative rounded-2xl bg-[#ffef9c] border-2 border-[#d4a017] shadow-md p-4">

      <div className="flex items-center gap-4">

        {/* Pet Photo */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {pet?.photo ? (
            <img 
              src={pet.photo} 
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <PawPrint className="text-gray-400" size={24} />
          )}
        </div>

        {/* Pet Info */}
        <div>
          <h2 className="text-lg font-bold">
            {pet?.name || t("pet")}
          </h2>

          <p className="text-sm text-gray-600">
            {pet?.breed || t("breed")} • {pet?.type || t("type")}
          </p>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">

        {/* SWITCH */}
        <button
          onClick={() => {
            const currentIndex = pets.findIndex(p => p.id === selectedPetId);
            const nextIndex = (currentIndex + 1) % pets.length;
            switchPet(pets[nextIndex].id);
          }}
          disabled={pets.length <= 1}
          className="
            w-8 h-8 rounded-full
            bg-white border border-[#d4a017]
            flex items-center justify-center
            disabled:opacity-40
          "
        >
          <Repeat size={16} className="text-[#d4a017]" />
        </button>

        {/* ADD */}
        <button
          onClick={handleAddPet}
          className="
            w-8 h-8 rounded-full
            bg-[#d4a017] text-white
            flex items-center justify-center
            hover:scale-110
          "
        >
          <Plus size={18} />
        </button>

      </div>

    </div>
  );
}
