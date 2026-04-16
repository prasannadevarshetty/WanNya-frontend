"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOnboardingStore } from "@/store/useOnboardingStore";

import ProgressBar from "@/components/onboarding/ProgressBar";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import AllergyGroup from "@/components/onboarding/AllergyGroup";
import { onboardingSteps } from "@/lib/onboardingRoutes";
import AuthButton from "@/components/ui/AuthButton";

type ErrorState = {
  petAllergies?: string;
  diet?: string;
};

export default function StepFourPage(): JSX.Element {
  const router = useRouter();
  const t = useTranslations("allergies");

  const {
    petAllergies,
    petSensitivities,
    addAllergy,
    removeAllergy,
    addSensitivity,
    removeSensitivity,
  } = useOnboardingStore();

  const [errors, setErrors] = useState<ErrorState>({});
  const [customAllergy, setCustomAllergy] = useState("");

  const handleNext = (): void => {
    const newErrors: ErrorState = {};

    if (customAllergy.trim() && !petAllergies.includes(customAllergy.trim())) {
      addAllergy(customAllergy.trim());
    }

    if (!petAllergies.length && !customAllergy.trim()) {
      newErrors.petAllergies = t("select");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    router.push(onboardingSteps[5]);
  };

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-6">
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar currentStep={4} totalSteps={7} />
      </div>

      {/* Header */}
      <div className="mb-10">
        <OnboardingHeader
          title={t("title")}
          onBack={() => router.push(onboardingSteps[3])}
        />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-md">
        {/* Allergies */}
        <h3 className="text-xl font-bold text-[#d4a017]">
          {t("allergies")}
        </h3>

        <div className={errors.petAllergies ? "shake" : ""}>
          <AllergyGroup
            items={[
              t("items.chicken"),
              t("items.beef"),
              t("items.dairy"),
              t("items.eggs"),
              t("items.wheat"),
              t("items.soy"),
              t("items.none"),
            ]}
            values={petAllergies}
            setValues={(v) => {
              if (v === t("items.none")) {
                petAllergies.forEach((a) => {
                  if (a !== t("items.none")) removeAllergy(a);
                });

                if (!petAllergies.includes(t("items.none"))) {
                  addAllergy(t("items.none"));
                }
                return;
              }

              if (petAllergies.includes(t("items.none"))) {
                removeAllergy(t("items.none"));
              }

              if (petAllergies.includes(v)) {
                removeAllergy(v);
              } else {
                addAllergy(v);
              }
            }}
          />
        </div>

        {errors.petAllergies && (
          <p className="mt-2 text-sm text-red-600">
            {errors.petAllergies}
          </p>
        )}

        {/* Custom Allergy */}
        <h3 className="text-xl font-bold text-[#d4a017] mt-10">
          {t("custom")}
        </h3>

        <input
          type="text"
          placeholder={t("placeholder")}
          value={customAllergy}
          onChange={(e) => {
            setCustomAllergy(e.target.value);
            setErrors((er) => ({ ...er, petAllergies: undefined }));
          }}
          className="
            w-full mt-4 px-6 py-4
            rounded-full border-2
            focus:outline-none transition
            border-[#d4a017]
          "
        />

        {/* Sensitivity */}
        <h3 className="text-xl font-bold text-[#d4a017] mt-10">
          {t("sensitivity")}
        </h3>

        <AllergyGroup
          items={[
            t("options.grainFree"),
            t("options.glutenFree"),
            t("options.lowFat"),
            t("options.sensitiveStomach"),
          ]}
          values={petSensitivities}
          setValues={(v) => {
            if (petSensitivities.includes(v)) {
              removeSensitivity(v);
            } else {
              addSensitivity(v);
            }
          }}
        />

        {/* Clear All */}
        <button
          onClick={() => {
            petAllergies.forEach((a) => removeAllergy(a));
            petSensitivities.forEach((v) => removeSensitivity(v));
            setCustomAllergy("");
            setErrors({});
          }}
          className="
            mt-10 px-8 py-3
            rounded-xl border-2 border-[#d4a017]
            font-bold text-[#d4a017]
          "
        >
          {t("clear")}
        </button>

        {/* Next */}
        <div className="mt-10">
          <AuthButton showIcon onClick={handleNext}>
            {t("next")}
          </AuthButton>
        </div>
      </div>
    </main>
  );
}
