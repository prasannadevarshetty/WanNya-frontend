"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { appleAuthHelpers } from "react-apple-signin-auth";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";

type Props = {
  provider: "google" | "apple";
};

export default function SocialButton({ provider }: Props) {
  const { socialLogin } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const config = {
    google: {
      label: "Continue with Google",
      icon: "/brands/google.svg",
    },
    apple: {
      label: "Continue with Apple",
      icon: "/brands/apple.svg",
    },
  }[provider];

  const handleSuccess = async (success: boolean) => {
    setLoading(false);
    if (success) {
      router.push("/dashboard"); // or check if new user and go to /onboarding
    } else {
      addNotification({ title: "Error", message: `Failed to login with ${provider}`, type: "error", read: false });
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const data = await res.json();
        const success = await socialLogin("google", data.sub, data.email, data.name, data.picture);
        handleSuccess(success);
      } catch (error) {
        console.error("Google login error:", error);
        setLoading(false);
        addNotification({ title: "Error", message: "Google login failed", type: "error", read: false });
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      addNotification({ title: "Error", message: "Google login failed", type: "error", read: false });
    },
  });

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const appleSignIn = appleAuthHelpers.signIn;
      if (!appleSignIn) {
        setLoading(false);
        addNotification({ title: "Unsupported", message: "Apple Sign in is not supported exactly on this platform without popup", type: "error", read: false });
        return;
      }
      const response = await appleAuthHelpers.signIn({
        authOptions: {
          clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "dummy.com",
          scope: "email name",
          redirectURI: typeof window !== "undefined" ? window.location.origin : "",
          state: "state",
          nonce: "nonce",
          usePopup: true,
        },
      });

      if (response && response.authorization && response.authorization.id_token) {
        const decoded: any = jwtDecode(response.authorization.id_token);
        const firstName = response.user?.name?.firstName || "";
        const lastName = response.user?.name?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim() || undefined;

        const success = await socialLogin(
          "apple",
          decoded.sub,
          decoded.email,
          fullName
        );
        handleSuccess(success);
      } else {
        setLoading(false);
        addNotification({ title: "Error", message: "Apple login failed", type: "error", read: false });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      addNotification({ title: "Error", message: "Apple login failed", type: "error", read: false });
    }
  };

  const handleClick = () => {
    if (provider === "google") {
      handleGoogleLogin();
    } else if (provider === "apple") {
      handleAppleLogin();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="
        w-full flex items-center justify-center gap-3
        py-4 rounded-full
        bg-white border
        shadow-sm hover:shadow-md
        transition disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      ) : (
        <img src={config.icon} alt={provider} className="w-5 h-5" />
      )}
      <span className="font-semibold text-gray-900">
        {loading ? "Connecting..." : config.label}
      </span>
    </button>
  );
}
