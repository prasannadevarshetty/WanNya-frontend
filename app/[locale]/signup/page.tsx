"use client";

import { useMemo, useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import TextInput from "@/components/auth/TextInput";
import PasswordInput from "@/components/auth/PasswordInput";
import TermsCheckbox from "@/components/auth/TermsCheckbox";
import Divider from "@/components/auth/Divider";
import SocialButton from "@/components/auth/SocialButton";
import PawPrintLoader from "@/components/ui/PawPrintLoader";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import AuthButton from "@/components/ui/AuthButton";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [terms, setTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuthStore();
  const t = useTranslations("signup");
  const nameError =
    name && name.length < 2 ? t("nameError") : "";

  const emailError =
    email && !email.includes("@") ? t("emailError") : "";

  const passwordError =
    password && password.length < 6
      ? t("passwordError")
      : "";

  const confirmError =
    confirm && confirm !== password ? t("passwordMatch") : "";

  const router = useRouter();

  const isFormValid = useMemo(() => {
    return (
      name &&
      email &&
      password &&
      confirm &&
      !emailError &&
      !passwordError &&
      !confirmError &&
      terms
    );
  }, [name, email, password, confirm, terms, emailError, passwordError, confirmError]);

  return (
    <main className="min-h-screen w-full bg-[#fff9ec] px-4 sm:px-6 py-8">
      <AuthHeader subtitle={t("title")} />

      <div className="mt-10 space-y-6 w-full max-w-md mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <TextInput
          label={t("fullName")}
          placeholder={t("petParent")}
          value={name}
          onChange={setName}
          error={nameError}
        />

        <TextInput
          label={t("email")}
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={setEmail}
          error={emailError}
        />

        <PasswordInput
          label={t("password")}
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={setPassword}
          error={passwordError}
        />

        <PasswordInput
          label={t("confirmPassword")}
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirm}
          onChange={setConfirm}
          error={confirmError}
        />

        <TermsCheckbox checked={terms} onChange={setTerms} />

        <AuthButton
          showIcon
          onClick={async () => {
            setIsSubmitting(true);
            const success = await register(name, email, password);
            setIsSubmitting(false);
            if (success) {
              router.push("/onboarding/step-1");
            }
          }}
          disabled={!isFormValid}
        >
          {t("createProfile")}
        </AuthButton>

        {/* <Divider />

        <SocialButton provider="google" />
        <SocialButton provider="apple" /> */}
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4">
            <PawPrintLoader />
            <p className="text-center text-amber-600 font-semibold mt-4">
              {t("creating")}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
