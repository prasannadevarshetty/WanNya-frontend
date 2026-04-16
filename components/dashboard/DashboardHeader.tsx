"use client";

import { Bell, ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import SearchBar from "@/components/search/SearchBar";

export default function DashboardHeader() {
  const router = useRouter();

  const { items } = useCartStore();
  const { notifications } = useNotificationStore();
  const wishlistStore = useWishlistStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-[#fff9ec] w-full overflow-visible">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6 pb-10">
        <div className="flex items-center justify-between gap-3">

          {/* Notifications */}
          <div
            className="relative cursor-pointer active:scale-95 transition shrink-0"
            onClick={() => router.push("/notifications")}
          >
            <Bell className="text-[#d4a017]" size={24} />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* 🔍 Search */}
          <div className="flex-1 flex justify-end md:justify-center px-2 md:px-4">
            <div className="w-full md:max-w-[640px]">
              <SearchBar />
            </div>
          </div>

          {/* Wishlist */}
          <div
            className="relative cursor-pointer active:scale-95 transition shrink-0"
            onClick={() => router.push("/dashboard/wishlist")}
          >
            <Heart className="text-[#d4a017]" size={24} />

            {wishlistStore.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold px-2 rounded-full">
                {wishlistStore.items.length}
              </span>
            )}
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer active:scale-95 transition shrink-0"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="text-[#d4a017]" size={24} />

            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4a017] text-white text-xs font-bold px-2 rounded-full">
                {items.length}
              </span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}