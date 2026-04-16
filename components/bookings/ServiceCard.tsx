"use client";

import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

type Props = {
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    rating: number;
    image: string;
  };
};

export default function ServiceCard({ service }: Props) {
  const router = useRouter();

  const goToDetails = () => {
    router.push(`/dashboard/shop/${service.id}`);
  };

  return (
    <div
      onClick={goToDetails}
      className="bg-white rounded-2xl shadow-md p-4 flex gap-4 hover:shadow-lg transition cursor-pointer"
    >
      {/* Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1">

        <div>
          <h4 className="text-lg font-semibold">{service.name}</h4>

          <p className="text-sm text-gray-500 mt-1">
            {service.description}
          </p>

          <p className="text-lg font-bold mt-1">
            ¥{service.price.toLocaleString()}
            <span className="text-sm text-gray-500 ml-1">
              / {service.duration}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">

          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-semibold">
              {service.rating}
            </span>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/shop/${service.id}`);
            }}
          >
            Book Now
          </Button>

        </div>
      </div>
    </div>
  );
}