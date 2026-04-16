"use client";

import { ArrowLeft, Trash2, MailOpen } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useTranslations } from "next-intl";

export default function NotificationsPage() {
  const router = useRouter();

  const t = useTranslations("notifications");
  const b = useTranslations("notifications.bookingConfirmed");

  const {
    notifications,
    markAllAsRead,
    deleteNotification,
    deleteAll,
  } = useNotificationStore();

  useEffect(() => {
    if (useNotificationStore.getState().notifications.length > 0) return;

    useNotificationStore.getState().addNotification({
      title: b("title"),
      message: b("desc"),
      content: b("desc"),
      expiryDate: `${b("expires")} 20 Aug 2026`,
      type: "success",
      read: false,
    });
  }, []);

  const hasNotifications = notifications.length > 0;

  return (
    <main className="min-h-screen bg-[#fff9ec] pb-32 sm:pb-24">
      
      {/* Header */}
      <div className="flex items-center gap-4 px-4 sm:px-6 py-6">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 rounded-full bg-[#f6d86b] flex items-center justify-center shrink-0"
        >
          <ArrowLeft className="text-[#d4a017]" />
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#d4a017]">
          {t("title")}
        </h1>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6">
        <div className="bg-[#fde9b4] border-4 border-[#d4a017] rounded-3xl overflow-hidden">
          
          {/* EMPTY STATE */}
          {!hasNotifications && (
            <div className="p-8 sm:p-12 text-center text-gray-600">
              <p className="text-lg sm:text-xl font-semibold mb-2">
                {t("empty")}
              </p>
              <p className="text-sm sm:text-base">
                {t("emptyDesc")}
              </p>
            </div>
          )}

          {/* LIST */}
          {hasNotifications &&
            notifications.map((n) => (
              <div
                key={n.id}
                className="
                  flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4
                  p-3 sm:p-4
                  border-b border-[#d4a017]
                  last:border-none
                "
              >
                {/* Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-300 rounded-xl shrink-0" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-bold text-sm sm:text-base ${
                      n.read ? "text-gray-600" : "text-[#d4a017]"
                    }`}
                  >
                    {n.title}
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm">
                    {n.content}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {n.expiryDate}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="text-red-600 shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom Actions */}
      {hasNotifications && (
        <div className="fixed bottom-6 left-0 right-0 px-4 sm:px-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          
          <button
            onClick={markAllAsRead}
            className="
              flex-1 flex items-center justify-center gap-2
              bg-[#d4a017] text-white
              py-3 sm:py-4 rounded-full font-semibold
            "
          >
            <MailOpen size={18} />
            {t("read")}
          </button>

          <button
            onClick={deleteAll}
            className="
              flex-1 flex items-center justify-center gap-2
              bg-red-600 text-white
              py-3 sm:py-4 rounded-full font-semibold
            "
          >
            <Trash2 size={18} />
            {t("deleteAll")}
          </button>

        </div>
      )}
    </main>
  );
}
