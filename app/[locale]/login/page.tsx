"use client";

import { useMemo, useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import TextInput from "@/components/auth/TextInput";
import PasswordInput from "@/components/auth/PasswordInput";
import Divider from "@/components/auth/Divider";
import SocialButton from "@/components/auth/SocialButton";
import RememberRow from "@/components/auth/RememberRow";
import ErrorPopup from "@/components/ui/ErrorPopup";
import PawPrintLoader from "@/components/ui/PawPrintLoader";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/ui/AuthButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const t = useTranslations('login');
  
  // Simple validation
  const emailError =
    email && !email.includes("@") ? t('emailError') : "";

  const passwordError =
    password && password.length < 6 ? t('passwordError') : "";

  const isFormValid = useMemo(() => {
    return email && password && !emailError && !passwordError;
  }, [email, password, emailError, passwordError]);
 
  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setErrorPopupOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-8">
      <AuthHeader subtitle={t('title')} />

      <div className="mt-10 space-y-6 max-w-md mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <TextInput
          label={t('email')}
          placeholder="pet.parent@email.com"
          value={email}
          onChange={setEmail}
          error={emailError}
        />

        <PasswordInput
          label={t('password')}
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={passwordError}
        />

        <RememberRow
          checked={remember}
          onChange={setRemember}
        />

        {/* Paw Login Button */}
        <AuthButton showIcon onClick={handleLogin} disabled={!isFormValid}>
          {t('login')}
        </AuthButton>
        <ErrorPopup
        open={errorPopupOpen}
        onClose={() => setErrorPopupOpen(false)}
        message={t('failed')}
      />
        {/* <Divider />

        <SocialButton provider="google" />
        <SocialButton provider="apple" /> */}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4">
            <PawPrintLoader />
            <p className="text-center text-amber-600 font-semibold mt-4">
              {t('loading')}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
