"use client";

import type { Gender } from "@/store/useOnboardingStore";
import { useTranslations } from "next-intl";

type GenderSelectorProps = {
  value: Gender | null;
  onChange: (v: Gender) => void;
};

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  const t = useTranslations("age");

  const options = [
    { key: "M", label: t("male") },
    { key: "F", label: t("female") },
  ];

  return (
    <div className="flex gap-6 mt-4">
      {options.map((g) => (
        <button
          key={g.key}
          onClick={() => onChange(g.key as Gender)}
          className={`
            w-16 h-16 rounded-xl border-2 text-xl font-bold
            ${
              value === g.key
                ? "bg-[#fff1b8] border-[#d4a017]"
                : "bg-white border-[#d4a017]/40"
            }
          `}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
