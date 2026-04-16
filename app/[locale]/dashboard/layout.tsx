"use client";

import DashboardFooter from "@/components/dashboard/DashboardFooter";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProductDetailsPage = pathname?.includes("/dashboard/shop/") && pathname.split("/").length > 3;

  return (
    <div className="min-h-screen bg-[#fff9ec] flex flex-col">

      <DashboardHeader />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {children}
      </main>

      {!isProductDetailsPage && <DashboardFooter />}

    </div>
  );
}