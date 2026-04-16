"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
};

export default function RememberRow({ checked, onChange }: Props) {
  const t = useTranslations("login");

  return (
    <div className="flex items-center justify-between text-sm">
      <label className="flex items-center gap-2 text-[#d4a017]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 accent-[#d4a017]"
        />
        {t("remember")}
      </label>

     <Link
      href="/forgot-password"
      className="underline text-[#d4a017] font-semibold"
    >
      {t("forgot")}
    </Link>
    </div>
  );
}
