"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Store, Calendar, Utensils, User } from "lucide-react";
import { useTranslations } from 'next-intl';

const navIcons = [
  { key: "home",     icon: Home,     path: "/dashboard" },
  { key: "shop",     icon: Store,    path: "/dashboard/shop" },
  { key: "bookings", icon: Calendar, path: "/dashboard/bookings" },
  { key: "bentos",   icon: Utensils, path: "/dashboard/bentos" },
  { key: "profile",  icon: User,     path: "/dashboard/profile" },
];

export default function DashboardFooter() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');

  const navItems = navIcons.map((item) => ({ ...item, label: t(item.key as any) }));

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.path);

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1"
            >
              <Icon
                size={24}
                className={
                  isActive ? "text-[#d4a017]" : "text-gray-400"
                }
              />
              <span
                className={`text-sm font-semibold ${
                  isActive
                    ? "text-[#d4a017]"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}