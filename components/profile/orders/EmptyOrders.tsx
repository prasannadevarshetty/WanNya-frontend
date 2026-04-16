"use client";

import { Package } from "lucide-react";
import { useRouter } from "next/navigation";
import  Button  from "@/components/ui/Button";

export default function EmptyOrders() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">

      {/* Icon */}
      <div className="bg-yellow-100 p-4 rounded-full mb-4">
        <Package className="text-yellow-500" size={28} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800">
        No orders yet
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 mt-1 max-w-xs">
        Your pet deserves the best meals. Start exploring our premium food plans.
      </p>

      {/* CTA */}
      <Button
        onClick={() => router.push("/dashboard/shop")}
        className="mt-5 px-6 py-2 rounded-full bg-yellow-400 text-black font-semibold shadow hover:scale-105 transition"
      >
        Explore Shop
      </Button>

    </div>
  );
}