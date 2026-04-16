"use client";

import DashboardContainer from "@/components/dashboard/DashboardContainer";
import ProductCard from "@/components/dashboard/ProductCard";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();

  const wishlistStore = useWishlistStore();

  return (
    <DashboardContainer>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-2xl font-bold text-[#1f2937]">
          Wishlist ❤️
        </h2>
      </div>

      {wishlistStore.items.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {wishlistStore.items.map((item) => (
            <div key={item.id} className="relative">

              {/* Delete button */}
              <button
                onClick={() =>
                  wishlistStore.removeItem(item.id)
                }
                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full border border-red-200 bg-red-50 hover:bg-red-100 transition"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>

              {/* Product Card */}
              <ProductCard
                product={{
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  rating: item.rating,
                }}
              />

            </div>
          ))}

        </div>
      )}

    </DashboardContainer>
  );
}