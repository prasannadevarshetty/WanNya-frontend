"use client";

import { useState } from "react";
import { Pencil, CalendarCheck, ShoppingBag, Star, Gift, Camera, Loader2 } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useTranslations } from 'next-intl';

type Props = {
  onEdit: () => void;
};

export default function ProfileHeader({ onEdit }: Props) {
  const { user, orders, uploadUserAvatar } = useProfileStore();
  const { addNotification } = useNotificationStore();
  const [isUploading, setIsUploading] = useState(false);
  const t = useTranslations('profile');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        title: "File too large",
        message: "Please upload an image smaller than 5MB",
        type: "error",
        read: false,
      });
      return;
    }

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          await uploadUserAvatar(base64String);
          addNotification({
            title: "Success",
            message: "Profile picture updated",
            type: "success",
            read: false,
          });
        } catch (error) {
          console.error("Upload failed", error);
          addNotification({
            title: "Upload failed",
            message: "Could not upload profile picture",
            type: "error",
            read: false,
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      addNotification({
        title: "Error",
        message: "Failed to read file",
        type: "error",
        read: false,
      });
    }
  };

  const reservations =
    orders.filter((o) => o.category === "booking").length || 0;

  const purchased =
    orders.filter((o) => o.category === "shop").length || 0;

  const rating = user.rating || 0;
  const points = user.points || 0;

  const stats = [
    {
      label: t('reservations'),
      value: reservations,
      icon: CalendarCheck,
    },
    {
      label: t('purchased'),
      value: purchased,
      icon: ShoppingBag,
    },
    {
      label: t('rating'),
      value: rating,
      icon: Star,
    },
    {
      label: t('points'),
      value: points,
      icon: Gift,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#f6d86b] to-[#f0c84b] pt-10 pb-16 rounded-xl">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

          {/* Avatar */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0 group border-4 border-white/40 shadow-xl bg-gray-300">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#f4c430] to-[#d4a017] flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}

            {/* Upload Overlay */}
            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white z-10">
              {isUploading ? (
                <Loader2 className="animate-spin mb-1" size={24} />
              ) : (
                <Camera size={24} className="mb-1" />
              )}
              <span className="text-xs font-medium">{isUploading ? 'Uploading...' : 'Change'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left">

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <h1 className="text-3xl md:text-4xl font-bold">
                {user.name || "User_Name"}
              </h1>

              <button onClick={onEdit}>
                <Pencil
                  size={22}
                  className="text-[#d4a017] cursor-pointer"
                />
              </button>
            </div>

            <p className="text-lg md:text-xl text-gray-700 mt-2">
              {user.email || "user_email@gmail.com"}
            </p>

          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white/70 backdrop-blur rounded-xl p-4 text-center shadow-sm"
              >
                <Icon size={26} className="mx-auto text-[#d4a017] mb-1" />
                <p className="text-lg font-bold text-[#d4a017]">{stat.value}</p>
                <p className="text-xs text-gray-600 truncate">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}