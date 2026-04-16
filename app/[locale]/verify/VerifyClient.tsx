"use client";

import { useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import OtpInput from "@/components/auth/OtpInput";
import Button from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import apiService from '@/lib/api';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function VerifyClient() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const email = search?.get('email') || '';
  const notify = useNotificationStore.getState().addNotification;

  const getErrorMessage = (err: unknown) => {
    if (err && typeof err === 'object' && 'message' in err) {
      const msg = (err as { message?: unknown }).message;
      if (typeof msg === 'string') return msg;
    }
    return undefined;
  };

  const handleComplete = async (otpValue: string) => {
    try {
      const res = await apiService.verifyOtp(email, otpValue);
      const token = res?.resetToken;

      notify({
        title: 'Verified',
        message: 'OTP verified. Proceed to reset password.',
        type: 'success',
        read: false
      });

      router.push(`/reset-password?token=${encodeURIComponent(token)}`);
    } catch (err: unknown) {
      setError(true);
      notify({
        title: 'Invalid OTP',
        message: getErrorMessage(err) || 'Verification failed',
        type: 'error',
        read: false
      });
      setTimeout(() => setError(false), 500);
    }
  };

  const handleResend = async () => {
    try {
      await apiService.sendOtp(email);
      notify({
        title: 'OTP Sent',
        message: 'A new OTP has been sent to your email',
        type: 'success',
        read: false
      });
    } catch (err: unknown) {
      notify({
        title: 'Error',
        message: getErrorMessage(err) || 'Failed to resend OTP',
        type: 'error',
        read: false
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-8">
      <AuthHeader />

      <div className="mt-16 space-y-8 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold text-[#d4a017]">
          Enter Verification Code
        </h2>

        <OtpInput
          length={6}
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          onResend={handleResend}
          hasError={error}
        />

        <Button
          onClick={() => handleComplete(otp.join(""))}
          disabled={otp.some((d) => d === "")}
        >
          Verify
        </Button>
      </div>
    </main>
  );
}
