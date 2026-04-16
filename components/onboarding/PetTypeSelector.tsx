"use client";

import { PetType } from "@/lib/types";
import { useTranslations } from "next-intl";

type Props = {
  value: PetType;
};

export default function PetTypeSelector({ value }: Props) {
  const t = useTranslations("petBreed");

  return (
    <div className="flex justify-center">
      <div className="px-10 py-3 rounded-full border-2 border-[#d4a017] bg-[#fff1b8] text-lg font-bold">
        {value === "dog" ? t("dog") : t("cat")}
      </div>
    </div>
  );
}
