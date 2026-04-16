"use client";

import type { PetType } from "@/store/useOnboardingStore";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useProfileStore } from "@/store/useProfileStore";
import ProgressBar from "@/components/onboarding/ProgressBar";
import PetTypeSelector from "@/components/onboarding/PetTypeSelector";
import PetAvatar from "@/components/onboarding/PetAvatar";
import TipBox from "@/components/onboarding/TipBox";
import TextInput from "@/components/auth/TextInput";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { onboardingSteps } from "@/lib/onboardingRoutes";
import AuthButton from "@/components/ui/AuthButton";
import { useTranslations } from "next-intl";

type ErrorState = {
  petType: boolean;
  petName: boolean;
};

function StepOneContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPetId = searchParams.get("edit");

  const t = useTranslations("petProfile");

  const { pets } = useProfileStore();
  const {
    petType,
    petName,
    setPetName,
    setPetType,
    isEditMode,
    loadPetForEdit,
    setEditMode,
  } = useOnboardingStore();

  const [errors, setErrors] = useState<ErrorState>({
    petType: false,
    petName: false,
  });

  useEffect(() => {
    if (editPetId && pets.length > 0) {
      const petToEdit = pets.find((pet) => pet.id === editPetId);
      if (petToEdit) {
        loadPetForEdit(petToEdit);
      }
    }
  }, [editPetId, pets, loadPetForEdit]);

  useEffect(() => {
    if (!editPetId && isEditMode) {
      setEditMode(false);
    }
  }, [editPetId, isEditMode, setEditMode]);

  const handleNext = (): void => {
    const newErrors: ErrorState = {
      petType: !petType,
      petName: !petName.trim(),
    };

    setErrors(newErrors);

    if (newErrors.petType || newErrors.petName) return;

    router.push(onboardingSteps[2]);
  };

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-6">
      <div className="mb-6">
        <ProgressBar currentStep={1} totalSteps={7} />
      </div>

      <div className="mb-10">
        <OnboardingHeader
          title={isEditMode ? t("editTitle") : t("title")} 
        />
      </div>

      <div className="mx-auto w-full max-w-md">
        {petType && <PetTypeSelector value={petType} />}

        {/* Pet avatar */}
        <div className={`mt-6 ${errors.petType ? "shake" : ""}`}>
          <PetAvatar
            pet={petType ?? "dog"}
            hasError={errors.petType}
            onChange={(value: PetType) => {
              setPetType(value);
              setErrors((prev) => ({ ...prev, petType: false }));
            }}
          />
        </div>

        {/* Pet name */}
        <div className={`mt-8 ${errors.petName ? "shake" : ""}`}>
          <TextInput
            label={t("petName")}
            placeholder={t("placeholder")}
            value={petName}
            error={errors.petName ? t("petNameError") : ""}
            onChange={(value: string) => {
              setPetName(value);
              setErrors((prev) => ({ ...prev, petName: false }));
            }}
          />
        </div>

        <TipBox />

        <div className="mt-10">
          <AuthButton showIcon onClick={handleNext}>
            {t("next")}
          </AuthButton>
        </div>
      </div>
    </main>
  );
}

export default function StepOnePage(): JSX.Element {
  return (
    <Suspense>
      <StepOneContent />
    </Suspense>
  );
}
