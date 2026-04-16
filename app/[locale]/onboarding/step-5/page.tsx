"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOnboardingStore } from "@/store/useOnboardingStore";

import ProgressBar from "@/components/onboarding/ProgressBar";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";

import { onboardingSteps } from "@/lib/onboardingRoutes";
import AuthButton from "@/components/ui/AuthButton";

export default function StepFivePage(): JSX.Element {
  const router = useRouter();
  const t = useTranslations("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    petAvatar,
    setPetAvatar,
    clearPetAvatar,
  } = useOnboardingStore();

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPetAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-6 flex flex-col">
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar currentStep={5} totalSteps={7} />
      </div>

      {/* Header */}
      <div className="mb-10">
        <OnboardingHeader
          title={t("pic")}
          onBack={() => router.push(onboardingSteps[4])}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Avatar */}
        <div className="relative">
          <div
            className="
              w-44 h-44 rounded-full
              bg-gradient-to-br from-[#f4c430] to-[#d4a017]
              flex items-center justify-center
              overflow-hidden shadow-lg
            "
          >
            {petAvatar ? (
              <img
                src={petAvatar}
                alt={t("pet")}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/icons/paw.svg"
                alt={t("default")}
                className="w-20 h-20"
              />
            )}
          </div>

          {/* Plus button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="
              absolute -bottom-4 -right-4
              w-12 h-12 rounded-full
              bg-[#d19c14] text-white text-2xl
              flex items-center justify-center
              shadow-lg
            "
          >
            +
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          />
        </div>

        {/* Note */}
        <div className="mt-10 text-center">
          <p className="font-bold text-gray-700">{t("note")}</p>
          <p className="text-[#d4a017] font-medium">
            {t("noteText")}
          </p>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex gap-4 mt-10">
        {/* Skip */}
        <button
          onClick={() => {
            clearPetAvatar();
            router.push(onboardingSteps[6]);
          }}
          className="
            basis-1/4 py-4 rounded-xl
            border-2 border-black
            font-bold text-black bg-white
            flex items-center justify-center
          "
        >
          {t("skip")}
        </button>

        {/* Next */}
        <AuthButton
          showIcon
          onClick={() => router.push(onboardingSteps[6])}
          className="basis-3/4"
        >
          {t("next")}
        </AuthButton>
      </div>
    </main>
  );
}
