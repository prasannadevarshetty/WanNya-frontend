"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOnboardingStore } from "@/store/useOnboardingStore";

import ProgressBar from "@/components/onboarding/ProgressBar";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import BreedSearchInput from "@/components/onboarding/BreedSearchInput";
import BreedGrid from "@/components/onboarding/BreedGrid";

import { onboardingSteps } from "@/lib/onboardingRoutes";
import AuthButton from "@/components/ui/AuthButton";

type ErrorState = {
  petBreed: boolean;
};

export default function StepTwoPage(): JSX.Element {
  const router = useRouter();
  const t = useTranslations("petBreed");

  const { petBreed, setPetBreed, petType, isEditMode } = useOnboardingStore();

  const [errors, setErrors] = useState<ErrorState>({
    petBreed: false,
  });

  const handleNext = (): void => {
    const hasError = !petBreed.trim();

    setErrors({ petBreed: hasError });

    if (hasError) return;

    router.push(onboardingSteps[3]);
  };

  const currentPetType = petType ?? "dog";

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-6">
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar currentStep={2} totalSteps={7} />
      </div>

      {/* Header */}
      <div className="mb-10">
        <OnboardingHeader
          title={
            isEditMode
              ? currentPetType === "cat"
                ? t("editCat")
                : t("editDog")
              : currentPetType === "cat"
              ? t("cat")
              : t("dog")
          }
          onBack={() => router.push(onboardingSteps[1])}
        />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-md">
        {/* Search */}
        <div className={errors.petBreed ? "shake" : ""}>
          <BreedSearchInput
            value={petBreed}
            petType={currentPetType}
            error={errors.petBreed}
            onChange={(value: string) => {
              setPetBreed(value);
              if (value) setErrors({ petBreed: false });
            }}
            onClear={() => setPetBreed("")}
          />
        </div>

        {/* Breed Grid */}
        <div className={`mt-6 ${errors.petBreed ? "shake" : ""}`}>
          <BreedGrid
            petType={currentPetType}
            selected={petBreed}
            onSelect={(value: string) => {
              setPetBreed(value);
              setErrors({ petBreed: false });
            }}
          />
        </div>

        {/* Note */}
        <p className="text-center text-[#d4a017] font-medium mt-10">
          {t.rich("note", {
            b: (chunks) => <b>{chunks}</b>,
          })}
        </p>

        {/* Button */}
        <div className="mt-10">
          <AuthButton showIcon onClick={handleNext}>
            {t("next")}
          </AuthButton>
        </div>
      </div>
    </main>
  );
}
