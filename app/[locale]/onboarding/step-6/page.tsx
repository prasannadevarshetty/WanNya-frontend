"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ProgressBar from "@/components/onboarding/ProgressBar";
import Summary from "@/components/onboarding/SummaryContent";
import { Edit3 } from "lucide-react";
import { onboardingSteps } from "@/lib/onboardingRoutes";
import AuthButton from "@/components/ui/AuthButton";

export default function StepSixPage(): JSX.Element {
  const router = useRouter();
  const t = useTranslations("summary");

  return (
    <main className="h-screen bg-[#fff9ec] flex flex-col overflow-hidden">
      {/* Progress */}
      <div className="px-6 pt-6 shrink-0">
        <ProgressBar currentStep={6} totalSteps={7} />
      </div>

      {/* Summary */}
      <div className="flex-1 px-6 overflow-hidden">
        <Summary />
      </div>

      {/* Footer */}
      <div className="shrink-0 bg-[#fff9ec] px-6 pb-6 pt-4 border-t border-black/10">
        <div className="flex gap-2">
          {/* Edit */}
          <button
            onClick={() => router.push(onboardingSteps[1])}
            className="basis-1/4 py-4 rounded-xl border-2 border-black font-bold bg-white flex items-center justify-center gap-2"
          >
            <Edit3 size={18} />
            {t("edit")}
          </button>

          {/* Finish */}
          <AuthButton
            showIcon
            onClick={() => router.push(onboardingSteps[7])}
            className="basis-3/4"
          >
            {t("finish")}
          </AuthButton>
        </div>
      </div>
    </main>
  );
}
