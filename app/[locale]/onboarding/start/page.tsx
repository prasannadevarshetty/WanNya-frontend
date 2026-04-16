// app/onboarding/start/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";

export default function StartOnboarding() {
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    resetOnboarding();
    router.push("/onboarding/step-1");
  }, []);

  return null;
}