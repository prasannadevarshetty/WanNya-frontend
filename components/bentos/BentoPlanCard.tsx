"use client";

import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

type Props = {
  plan: {
    id?: string;
    name: string;
    price: number;
    description: string;
    rating?: number;
    image?: string;
  };
};

export default function BentoPlanCard({ plan }: Props) {
  const cartStore = useCartStore();
  const router = useRouter();

  const handleNavigate = () => {
    if (plan.id) {
      router.push(`/dashboard/shop/${plan.id}`);
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className="bg-white rounded-2xl shadow-md p-4 flex gap-4 hover:shadow-lg transition cursor-pointer"
    >

      {/* Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
        {plan.image && (
          <img
            src={plan.image}
            alt={plan.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1">

        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            {plan.name}
          </h4>

          <p className="text-xl font-bold mt-1">
            ¥{plan.price.toLocaleString()}
            <span className="text-sm font-medium text-gray-500">
              {" "} / Month
            </span>
          </p>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {plan.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">

          {plan.rating !== undefined && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-semibold">
                {plan.rating}
              </span>
            </div>
          )}

          <Button
            onClick={(e) => {
              e.stopPropagation(); // prevents card navigation
              cartStore.addItem({
                id: plan.id ?? plan.name,
                name: plan.name,
                title: plan.name,
                price: plan.price,
                image: plan.image ?? "",
                category: 'plan',
                rating: plan.rating ?? 0,
                duration: "monthly",
              });
            }}
            className="flex items-center gap-1"
          >
            Add to Cart
          </Button>

        </div>
      </div>
    </div>
  );
}