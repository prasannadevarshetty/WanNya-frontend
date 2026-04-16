"use client";

import { useMemo, useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import TextInput from "@/components/auth/TextInput";
import Divider from "@/components/auth/Divider";
import PawPrintLoader from "@/components/ui/PawPrintLoader";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/ui/AuthButton";
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword, error } = useAuthStore();
  const t = useTranslations("forgotPassword");
  
  // Simple validation
  const emailError =
    email && !email.includes("@") ? t("invalidEmail") : "";

  const isFormValid = useMemo(() => {
    return email && !emailError;
  }, [email, emailError]);

  const notify = useNotificationStore.getState().addNotification;

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    const success = await forgotPassword(email);
    setIsSubmitting(false);

    if (success) {
      notify({ 
        title: t("otpSentTitle"), 
        message: t("otpSentMessage"), 
        type: 'success', 
        read: false 
      });
      // Navigate to reset password page
      router.push('/reset-password');
    } else {
      notify({ 
        title: t("errorTitle"), 
        message: error || t("errorMessage"), 
        type: 'error', 
        read: false 
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-8">
      {/* Header */}
      <AuthHeader subtitle="Forgot Password" />

      <div className="mt-10 space-y-6 max-w-md mx-auto">
        {/* Email */}
        <TextInput
          label={t("email")}
          placeholder="pet.parent@email.com"
          value={email}
          onChange={setEmail}
          error={emailError}
        />

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Back to login */}
        <div onClick={() => router.push("/login")} className="text-center text-[#d4a017] font-semibold underline cursor-pointer">
          {t("back")}
        </div>

        {/* Submit button */}
        <AuthButton showIcon onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? t("sending") : t("send")}
        </AuthButton>

        <Divider />

        {/* Sign up button */}
        <AuthButton showIcon variant="secondary" onClick={() => router.push('/register')}>
          {t("signup")}
        </AuthButton>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4">
            <PawPrintLoader />
            <p className="text-center text-amber-600 font-semibold mt-4">
              {t("loading")}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
