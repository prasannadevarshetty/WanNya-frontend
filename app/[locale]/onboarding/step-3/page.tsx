"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOnboardingStore } from "@/store/useOnboardingStore";

import ProgressBar from "@/components/onboarding/ProgressBar";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import GenderSelector from "@/components/onboarding/GenderSelector";
import DOBPicker from "@/components/onboarding/DOBPicker";

import { onboardingSteps } from "@/lib/onboardingRoutes";
import AuthButton from "@/components/ui/AuthButton";

/* -------------------- Date helpers -------------------- */

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getMaxDays = (month: string, year: number): number => {
  switch (month) {
    case "Feb": return isLeapYear(year) ? 29 : 28;
    case "Apr":
    case "Jun":
    case "Sep":
    case "Nov": return 30;
    default: return 31;
  }
};

const isFutureDate = (date: number, month: string, year: number): boolean => {
  const selected = new Date(year, MONTHS.indexOf(month), date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected > today;
};

/* ------------------------------------------------------ */

type ErrorState = {
  gender?: string;
  dob?: string;
};

export default function StepThreePage(): JSX.Element {
  const router = useRouter();
  const t = useTranslations("age");

  const {
    petGender,
    petBirthDate,
    setPetGender,
    setPetBirthDate,
  } = useOnboardingStore();

  const { date, month, year } = petBirthDate;

  const [errors, setErrors] = useState<ErrorState>({});

  const genderRef = useRef<HTMLDivElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);

  const handleNext = (): void => {
    const newErrors: ErrorState = {};

    if (!petGender) {
      newErrors.gender = t("errors.gender");
    }

    const d = Number(date);
    const y = Number(year);

    if (!d || !month || !y) {
      newErrors.dob = t("errors.incompleteDob");
    } else {
      const maxDays = getMaxDays(month, y);

      if (d > maxDays) {
        newErrors.dob = t("errors.invalidDay", {
          month,
          maxDays,
        });
      } else if (isFutureDate(d, month, y)) {
        newErrors.dob = t("errors.futureDob");
      }
    }

    setErrors(newErrors);

    if (newErrors.gender) {
      genderRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    if (newErrors.dob) {
      dobRef.current?.focus();
      return;
    }

    router.push(onboardingSteps[4]);
  };

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-6">
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar currentStep={3} totalSteps={7} />
      </div>

      {/* Header */}
      <div className="mb-10">
        <OnboardingHeader
          title={t("title")}
          onBack={() => router.push(onboardingSteps[2])}
        />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-md">
        {/* Gender */}
        <h3 className="text-lg font-bold text-[#d4a017]">
          {t("gender")}
        </h3>

        <div ref={genderRef} className={errors.gender ? "shake" : ""}>
          <GenderSelector
            value={petGender}
            onChange={(v) => {
              setPetGender(v);
              setErrors((e) => ({ ...e, gender: undefined }));
            }}
          />
        </div>

        {errors.gender && (
          <p className="mt-2 text-sm text-red-600">
            {errors.gender}
          </p>
        )}

        {/* DOB */}
        <h3 className="text-lg font-bold text-[#d4a017] mt-10">
          {t("dob")}
        </h3>

        <div className={`mt-4 ${errors.dob ? "shake" : ""}`}>
          <input
            ref={dobRef}
            type="text"
            value={`${date}/${month}/${year}`}
            readOnly
            placeholder={t("placeholder")}
            className={`
              w-full px-6 py-4
              rounded-full border-2
              text-center text-xl font-bold
              transition focus:outline-none
              ${
                errors.dob
                  ? "border-red-500 bg-red-50"
                  : "border-[#d4a017] bg-[#fff1b8]"
              }
            `}
          />
        </div>

        {errors.dob && (
          <p className="mt-2 text-sm text-red-600">
            {errors.dob}
          </p>
        )}

        {/* Picker */}
        <div className={errors.dob ? "shake" : ""}>
          <DOBPicker
            date={date}
            month={month}
            year={year}
            setDate={(v) => {
              const max = getMaxDays(month, Number(year || 2000));
              setPetBirthDate({
                ...petBirthDate,
                date: Math.min(Number(v), max)
                  .toString()
                  .padStart(2, "0"),
              });
              setErrors((e) => ({ ...e, dob: undefined }));
            }}
            setMonth={(v) => {
              setPetBirthDate({ ...petBirthDate, month: v });
              setErrors((e) => ({ ...e, dob: undefined }));
            }}
            setYear={(v) => {
              setPetBirthDate({ ...petBirthDate, year: v });
              setErrors((e) => ({ ...e, dob: undefined }));
            }}
          />
        </div>

        {/* Next */}
        <div className="mt-12">
          <AuthButton showIcon onClick={handleNext}>
            {t("next")}
          </AuthButton>
        </div>
      </div>
    </main>
  );
}
