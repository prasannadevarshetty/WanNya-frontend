"use client";

import DashboardContainer from "@/components/dashboard/DashboardContainer";
import BentoPlanCard from "@/components/bentos/BentoPlanCard";
import PetInfoCard from "@/components/dashboard/PetInfoCard";
import { useProfileStore } from "@/store/useProfileStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store/useSearchStore";
import { useTranslations } from "next-intl";

export default function BentosPage() {
  const router = useRouter();
  const { setQuery, clearFilters } = useSearchStore();
  const t = useTranslations('bento');

  const handleViewMore = () => {
    clearFilters();
    setQuery("bento");
    setTimeout(() => {
      router.push("/search");
    }, 200);
  };

  const { pets, selectedPetId } = useProfileStore();
  const activePet = pets.find((p) => p.id === selectedPetId);
  const petGender = activePet?.gender;

  // To be fetched from backend
  const allBentos: any[] = [];
  const bentoPlans = petGender 
    ? allBentos.filter(b => b.gender === petGender || b.gender === 'both' || !b.gender) 
    : allBentos;

  return (
    <DashboardContainer>
      {/* Pet Info Card */}
      <div className="max-w-[1000px]">
        <PetInfoCard />
      </div>
      
      <h2 className="text-2xl font-bold text-[#1f2937] mb-6 mt-6">
        {t('title')}
      </h2>

      <div className="space-y-5">
        {bentoPlans.map((plan, i) => (
          <BentoPlanCard key={plan.id || plan._id || i} plan={plan} />
        ))}
      </div>

      {/* View More */}
      {bentoPlans.length > 5 && (
        <div className="flex justify-center mt-8">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleViewMore}
            className="border-2 border-[#d4a017] px-6 py-2 rounded-full font-semibold text-gray-700"
          >
            View More +
          </motion.button>
        </div>
      )}
    </DashboardContainer>
  );
}