"use client";

import { useTranslations } from "next-intl";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { PawPrint, Calendar, AlertTriangle } from "lucide-react";

import OnboardingHeader from "@/components/onboarding/OnboardingHeader";

// ✅ Use stable keys (match JSON exactly)
const ALL_ALLERGIES = [
  "chicken",
  "beef",
  "dairy",
  "eggs",
  "wheat",
  "soy",
  "none",
];

const ALL_SENSITIVITIES = [
  "grainFree",
  "glutenFree",
  "lowFat",
  "sensitiveStomach",
];

type ChipProps = {
  label: string;
  selected?: boolean;
};

function Chip({ label, selected = false }: ChipProps): JSX.Element {
  return (
    <span
      className={`
        px-4 py-2 rounded-full border text-sm font-semibold
        ${
          selected
            ? "bg-[#f4c430] border-[#d4a017] text-[#5a3a00]"
            : "bg-[#e5e5e5] border-[#bdbdbd] text-[#8a8a8a]"
        }
      `}
    >
      {label}
    </span>
  );
}

export default function Summary(): JSX.Element {
  const t = useTranslations("summary");
  const tAllergies = useTranslations("allergies");

  const {
    petName,
    petType,
    petBreed,
    petBirthDate,
    petAllergies,
    petSensitivities,
    petAvatar,
  } = useOnboardingStore();

  const dobText =
    petBirthDate.date && petBirthDate.month && petBirthDate.year
      ? `${petBirthDate.date}/${petBirthDate.month}/${petBirthDate.year}`
      : t("notSpecified", { default: "Not specified" });

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-6 flex flex-col justify-center items-center">
      {/* Header */}
      <div className="mb-8">
        <OnboardingHeader title={t("title")} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Pet card */}
        <div className="flex items-center gap-6 mb-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#f4c430] to-[#d4a017] flex items-center justify-center overflow-hidden">
              {petAvatar ? (
                <img
                  src={petAvatar}
                  alt={t("petImageAlt", { default: "Pet" })}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PawPrint size={48} className="text-white" />
              )}
            </div>

            <div className="absolute -bottom-1 -right-1 bg-white border-2 border-[#d4a017] rounded-lg px-2 py-1 text-sm font-bold text-[#d4a017]">
              {petName?.[0]?.toUpperCase()}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#d4a017]">
              {petName}
            </h2>

            <p className="text-[#caa03c] font-semibold">
              {(petType ?? "")} • {petBreed || t("mixed", { default: "Mixed" })}
            </p>

            <p className="flex items-center gap-2 text-[#caa03c] font-semibold">
              <Calendar size={16} />
              {dobText}
            </p>
          </div>
        </div>

        {/* Allergies */}
        <h3 className="text-xl font-bold text-[#d4a017] mb-4 flex items-center gap-2">
          <AlertTriangle size={18} />
          {t("allergies")}
        </h3>

        <div className="flex flex-wrap gap-3 mb-8">
          {ALL_ALLERGIES.map((item) => (
            <Chip
              key={item}
              label={tAllergies(`items.${item}`)}
              selected={petAllergies.includes(item)}
            />
          ))}
        </div>

        {/* Sensitivity */}
        <h3 className="text-xl font-bold text-[#d4a017] mb-4 flex items-center gap-2">
          <AlertTriangle size={18} />
          {t("sensitivity")}
        </h3>

        <div className="flex flex-wrap gap-3 mb-8">
          {ALL_SENSITIVITIES.map((item) => (
            <Chip
              key={item}
              label={tAllergies(`options.${item}`)}
              selected={petSensitivities.includes(item)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
