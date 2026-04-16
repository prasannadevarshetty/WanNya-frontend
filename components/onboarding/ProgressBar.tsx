"use client";

import { useTranslations } from "next-intl";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const t = useTranslations("petProfile");

  const progress = Math.min(
    (currentStep / totalSteps) * 100,
    100
  );

  return (
    <div className="px-6 pt-6">
      <div className="flex justify-between text-sm font-medium text-[#c9971a] mb-2">
        <span>
          {t("step")} {currentStep}/{totalSteps}
        </span>

        <span>{Math.round(progress)}%</span>
      </div>

      <div className="h-3 w-full rounded-full bg-[#e6e6e6]">
        <div
          className="h-3 rounded-full bg-[#d4a017] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
