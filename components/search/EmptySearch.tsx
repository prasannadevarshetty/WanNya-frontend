"use client";

import { useTranslations } from "next-intl";

interface EmptySearchProps {
  onClear?: () => void;
}

export default function EmptySearch({ onClear }: EmptySearchProps) {

  const t = useTranslations("search");
  
  return (
    <div className="w-full bg-white border border-[#ede5c4] rounded-3xl px-6 py-8 text-center">
      <div className="text-4xl mb-4">🐾</div>

      <h2 className="text-base font-semibold text-[#3d2f00] mb-2">
        {t("no")}
      </h2>

      <p className="text-xs text-[#9c7000] mb-5 leading-relaxed">
        {t("tryAgain")}
      </p>

      <ul className="mb-6 divide-y divide-[#f5eccc]">
        {[t("removeAllergy"), t("increasePrice"), t("checkSpelling")].map((tip) => (
          <li key={tip} className="py-2.5 text-xs text-[#b08000]">
            {tip}
          </li>
        ))}
      </ul>

      <button
        onClick={onClear}
        className="w-full bg-[#d4a017] hover:bg-[#c9940f] transition-colors text-white font-medium text-sm rounded-full py-3"
      >
        {t("clear")}
      </button>
    </div>
  );
}
