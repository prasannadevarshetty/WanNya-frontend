"use client";

import { Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TipBox() {
  const t = useTranslations("petProfile");

  return (
    <div className="flex gap-3 text-[#d4a017] mt-6">
      <Lightbulb />
      <p className="text-sm font-semibold">
        <span className="font-bold">{t("tip")}</span>{" "}
        {t("tipText")}
      </p>
    </div>
  );
}
