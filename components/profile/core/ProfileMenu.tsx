"use client";

import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useTranslations } from 'next-intl';
import OrdersSection from "../orders/OrdersSection";
import AddressCard from "@/components/profile/address/AddressCard";

export default function ProfileMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const { language, setLanguage } = useLanguageStore();
  const router = useRouter();
  const t = useTranslations('profile');

  const toggle = (section: string) => {
    setOpen(open === section ? null : section);
  };

  // 🔥 LANGUAGE SWITCH HANDLER (FIXED)
  const handleLanguageChange = (lang: "en" | "ja") => {
    const pathWithoutLocale =
      window.location.pathname.replace(/^\/(ja|en)/, '') || '/';

    const newPath =
      lang === 'en'
        ? pathWithoutLocale
        : `/${lang}${pathWithoutLocale}`;

    router.replace(newPath);
    router.refresh();

    setLanguage(lang); // optional (for UI highlight)
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      {/* ADDRESSES */}
      <button
        onClick={() => toggle("addresses")}
        className="w-full flex justify-between items-center p-4 border-b"
      >
        {t('addresses')}
        <ChevronDown
          className={`transition ${open === "addresses" ? "rotate-180" : ""}`}
        />
      </button>

      {open === "addresses" && (
        <div className="p-4 space-y-4">
          <AddressCard />
        </div>
      )}

      {/* 🔥 PREMIUM LANGUAGE TOGGLE */}
      <div className="w-full flex justify-between items-center p-4 border-b">
        <span className="text-gray-800 font-medium">{t('language')}</span>

        <div className="relative flex bg-gray-100 rounded-full p-1 w-[90px]">
          
          {/* Sliding Indicator */}
          <div
            className={`
              absolute top-1 bottom-1 w-[40px] rounded-full bg-yellow-400 shadow
              transition-all duration-300
              ${language === "ja" ? "translate-x-[44px]" : "translate-x-0"}
            `}
          />

          {/* EN */}
          <button
            onClick={() => handleLanguageChange("en")}
            className="relative z-10 flex-1 text-sm font-semibold text-center"
          >
            EN
          </button>

          {/* JP */}
          <button
            onClick={() => handleLanguageChange("ja")}
            className="relative z-10 flex-1 text-sm font-semibold text-center"
          >
            JP
          </button>
        </div>
      </div>

      {/* ORDERS */}
      <button
        onClick={() => toggle("orders")}
        className="w-full flex justify-between items-center p-4 border-b"
      >
        {t('orders')}
        <ChevronDown
          className={`transition ${open === "orders" ? "rotate-180" : ""}`}
        />
      </button>

      {open === "orders" && (
        <div className="p-4 space-y-4">
          <OrdersSection />
        </div>
      )}

      {/* HELP */}
      <button
        onClick={() => toggle("help")}
        className="w-full flex justify-between items-center p-4"
      >
        {t('help')}
        <ChevronDown
          className={`transition ${open === "help" ? "rotate-180" : ""}`}
        />
      </button>

      {open === "help" && (
        <div className="p-4 text-sm text-gray-600">
          Contact Support
        </div>
      )}

      {/* LOGOUT */}
      <button
        onClick={async () => {
          try {
            await useAuthStore.getState().logout();

            useNotificationStore.getState().addNotification({
              title: 'Logged out',
              message: 'You have been logged out successfully.',
              type: 'success',
              read: false,
            });

            router.push('/login');
          } catch (err) {
            console.error('Logout failed', err);

            useNotificationStore.getState().addNotification({
              title: 'Logout failed',
              message: 'Could not log you out. Please try again.',
              type: 'error',
              read: false,
            });
          }
        }}
        className="w-full flex items-center justify-center gap-2 p-4 bg-red-600 text-white font-semibold hover:bg-red-700 rounded-b-2xl"
      >
        <LogOut />
        <span className="ml-2">{t("logout")}</span>
      </button>

    </div>
  );
}
