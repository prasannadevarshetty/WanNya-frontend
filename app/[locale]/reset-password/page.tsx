"use client";

import { useMemo, useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import PasswordInput from "@/components/auth/PasswordInput";
import Divider from "@/components/auth/Divider";
import OtpInput from "@/components/auth/OtpInput";
import PawPrintLoader from "@/components/ui/PawPrintLoader";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/ui/AuthButton";
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpError, setShowOtpError] = useState(false);
  
  const { 
    forgotPasswordEmail, 
    resetPassword, 
    error, 
    forgotPassword: resendOtp 
  } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const notify = useNotificationStore.getState().addNotification;

  // Validation
  const passwordError = useMemo(() => {
    if (newPassword && newPassword.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  }, [newPassword]);

  const confirmPasswordError = useMemo(() => {
    if (confirmPassword && confirmPassword !== newPassword) {
      return "Passwords do not match";
    }
    return "";
  }, [confirmPassword, newPassword]);

  const isFormValid = useMemo(() => {
    return (
      otp.every(digit => digit !== "") &&
      newPassword &&
      confirmPassword &&
      !passwordError &&
      !confirmPasswordError
    );
  }, [otp, newPassword, confirmPassword, passwordError, confirmPasswordError]);

  const handleOtpComplete = async (completedOtp: string) => {
    setShowOtpError(false);
  };

  const handleResendOtp = async () => {
    if (!forgotPasswordEmail) return;
    
    const success = await resendOtp(forgotPasswordEmail);
    if (success) {
      notify({ 
        title: 'OTP Resent', 
        message: 'Check your email for the new verification code', 
        type: 'success', 
        read: false 
      });
      // Reset OTP input
      setOtp(Array(6).fill(""));
      setShowOtpError(false);
    } else {
      notify({ 
        title: 'Error', 
        message: error || 'Failed to resend OTP', 
        type: 'error', 
        read: false 
      });
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || !forgotPasswordEmail || isSubmitting) return;

    setIsSubmitting(true);
    const otpString = otp.join("");
    const success = await resetPassword(forgotPasswordEmail, otpString, newPassword);
    setIsSubmitting(false);
    
    if (success) {
      notify({ 
        title: 'Success', 
        message: 'Password reset successfully! Please login with your new password.', 
        type: 'success', 
        read: false 
      });
      router.push('/login');
    } else {
      setShowOtpError(true);
      notify({ 
        title: 'Error', 
        message: error || 'Failed to reset password', 
        type: 'error', 
        read: false 
      });
    }
  };

  const handleOtpChange = (newOtp: string[]) => {
    setOtp(newOtp);
    setShowOtpError(false);
  };

  return (
    <main className="min-h-screen bg-[#fff9ec] px-6 py-8">
      {/* Header */}
      <AuthHeader subtitle="Reset Password" />

      <div className="mt-10 space-y-6 max-w-md mx-auto">
        {/* Email display */}
        <div className="text-center text-gray-600">
          Email: <span className="font-semibold">{forgotPasswordEmail || 'No email found'}</span>
        </div>

        {/* OTP Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Enter 6-digit OTP
          </label>
          <OtpInput
            length={6}
            value={otp}
            onChange={handleOtpChange}
            onComplete={handleOtpComplete}
            onResend={handleResendOtp}
            hasError={showOtpError}
          />
        </div>

        {/* New Password */}
        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={setNewPassword}
          error={passwordError}
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={confirmPasswordError}
        />

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Back to login */}
        <div onClick={() => router.push("/login")} className="text-center text-[#d4a017] font-semibold underline cursor-pointer">
          Back to Login
        </div>

        {/* Submit button */}
        <AuthButton showIcon onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Verify & Reset Password'}
        </AuthButton>

        <Divider />

        {/* Sign up button */}
        <AuthButton showIcon variant="secondary" onClick={() => router.push('/register')}>
          Sign up
        </AuthButton>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4">
            <PawPrintLoader />
            <p className="text-center text-amber-600 font-semibold mt-4">
              Resetting your password...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
