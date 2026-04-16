"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  title?: string;
  onBack?: () => void;
};

export default function OnboardingHeader({
  title,
  onBack,
}: Props) {
  const t = useTranslations("petProfile");

  return (
    <div className="flex items-center justify-between">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow"
        >
          <ArrowLeft className="w-5 h-5 text-[#d4a017]" />
        </button>
      )}

      {/* Center logo + subtitle */}
      <div className="flex-1 text-center">
        <img
          src="/logo.png"
          alt="WanNya"
          className="mx-auto h-10"
        />

        <p className="text-base font-bold text-[#d4a017] mt-1">
          {title || t("title")}
        </p>
      </div>

      {/* Spacer */}
      <div className="w-10" />
    </div>
  );
}
