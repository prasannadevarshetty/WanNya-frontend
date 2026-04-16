"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ProgressBar from "@/components/onboarding/ProgressBar";
import Summary from "@/components/onboarding/SummaryContent";
import PawPrintLoader from "@/components/ui/PawPrintLoader";
import { useState } from "react";

import { useProfileStore } from "@/store/useProfileStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import AuthButton from "@/components/ui/AuthButton";

export default function StepSevenPage(): JSX.Element {
  const router = useRouter();
  const t = useTranslations("summary"); // 👈 i18n
  const { addNotification } = useNotificationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addPetToDB, updatePetInDB, uploadPetPhoto } = useProfileStore();
  const {
    petName,
    petType,
    petBreed,
    petGender,
    petBirthDate,
    petAllergies,
    petSensitivities,
    petAvatar,
    resetOnboarding,
    isEditMode,
    editingPetId,
  } = useOnboardingStore();

  const handleFinish = async () => {
    if (!petName || !petType || !petBreed) return;

    try {
      setIsSubmitting(true);

      const petData = {
        name: petName,
        breed: petBreed,
        type: petType,
        gender: petGender,
        dob: petBirthDate,
        allergies: petAllergies,
        sensitivities: petSensitivities,
      };

      if (
        petBirthDate &&
        (!petBirthDate.date || !petBirthDate.month || !petBirthDate.year)
      ) {
        throw new Error("Invalid date of birth format");
      }

      let updatedPet;

      if (isEditMode && editingPetId) {
        await updatePetInDB(editingPetId, petData);

        if (petAvatar) {
          try {
            await uploadPetPhoto(editingPetId, petAvatar);
          } catch {}
        }

        const { pets } = useProfileStore.getState();
        updatedPet = pets.find((p) => p.id === editingPetId);
      } else {
        const newPet = await addPetToDB(petData);
        updatedPet = newPet;

        if (petAvatar && updatedPet?.id) {
          try {
            await uploadPetPhoto(updatedPet.id, petAvatar);
          } catch {}
        }
      }

      resetOnboarding();

      addNotification({
        title: isEditMode ? t("update") : "Pet created",
        message: isEditMode
          ? "Your pet was updated successfully."
          : "Your pet was created successfully.",
        type: "success",
        read: false,
      });

      setIsSubmitting(false);
      router.push("/dashboard/profile");
    } catch (error: any) {
      setIsSubmitting(false);

      const errMsg = error?.message || "Please try again.";

      addNotification({
        title: "Failed to save pet",
        message: `Failed to ${
          isEditMode ? "update" : "create"
        } pet: ${errMsg}`,
        type: "error",
        read: false,
      });
    }
  };

  return (
    <main className="h-screen bg-[#fff9ec] flex flex-col overflow-hidden">
      {/* Progress */}
      <div className="px-6 pt-6 shrink-0">
        <ProgressBar currentStep={7} totalSteps={7} />
      </div>

      {/* Summary */}
      <div className="flex-1 relative px-6 overflow-y-hidden">
        <Summary />

        <motion.img
          src="/stamp.png"
          alt="WanNya Stamp"
          initial={{ opacity: 0, scale: 1.15, y: -40, rotate: -8 }}
          animate={{
            opacity: 1,
            scale: [1.15, 0.92, 1.02, 1],
            y: [-40, 0, 6, 0],
            rotate: -5,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            times: [0, 0.45, 0.7, 1],
          }}
          className="absolute right-4 bottom-6 sm:right-10 sm:bottom-16 md:right-20 md:bottom-24 w-24 sm:w-28 md:w-32 opacity-90 pointer-events-none"
        />
      </div>

      {/* CTA */}
      <div className="shrink-0 bg-[#fff9ec] px-6 pb-6 pt-4 border-t border-black/10">
        <AuthButton
          showIcon
          className="w-full py-4 flex items-center justify-center gap-2"
          onClick={handleFinish}
          disabled={isSubmitting}
        >
          {isEditMode
            ? t("update")
            : isSubmitting
            ? "Saving..."
            : "Go to Dashboard"}
        </AuthButton>
      </div>

      {/* Loading */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4">
            <PawPrintLoader />
            <p className="text-center text-amber-600 font-semibold mt-4">
              Saving pet profile...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
