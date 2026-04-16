"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function CartHeader() {
  const router = useRouter();
  const t = useTranslations("cart");
  return (
    <div className="flex items-center gap-4 px-6 py-6 bg-[#fff9ec]">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="
          w-12 h-12
          rounded-full
          bg-[#f6d86b]
          flex items-center justify-center
          shadow-sm
          active:scale-95
          transition
        "
      >
        <ArrowLeft size={22} className="text-[#d4a017]" />
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold text-[#d4a017]">
        {t("title")}
      </h1>
    </div>
  );
}
