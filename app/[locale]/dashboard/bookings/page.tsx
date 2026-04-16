"use client";

import { useState, useEffect } from "react";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import { Star } from "lucide-react";
import PetInfoCard from "@/components/dashboard/PetInfoCard";
import { useTranslations } from "next-intl";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  category: string;
}

export default function BookingsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const t = useTranslations('booking');

  // 🔥 Replace with backend later
  useEffect(() => {
    fetch("/api/services") // change to your API
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(() => console.log("using fallback"));
  }, []);

  // 🔥 Group by category
  const grouped = {
    salons: services.filter(s => s.category === "grooming"),
    clinics: services.filter(s => s.category === "clinic"),
    hotels: services.filter(s => s.category === "hotel"),
  };

  return (
    <DashboardContainer>
      <div className="space-y-6 pb-24">

        {/* Pet Profile Card */}
        <PetInfoCard />

        {/* Page Title */}
        <div className="px-2">
          <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
        </div>

        {/* SERVICE SECTIONS */}
        {Object.entries(grouped).map(([key, list]) => (
          list.length > 0 && (
            <div key={key} className="px-2">

              {/* Section Title */}
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                {key === "salons" ? t('salons') :
                 key === "clinics" ? t('clinics') :
                 t('hotels')}
              </h2>

              {/* Horizontal Scroll */}
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">

                {list.map(service => (
                  <div
                    key={service.id}
                    className="min-w-[280px] bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0"
                  >
                    {/* Image */}
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-32 object-cover"
                    />

                    {/* Content */}
                    <div className="p-4">
                      {/* Title */}
                      <h3 className="text-base font-semibold text-gray-800 mb-1">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Price & Duration */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-800">
                          ₹{service.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          • {service.duration}
                        </span>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star size={16} className="fill-yellow-500" />
                          <span className="text-sm font-medium">
                            {service.rating}
                          </span>
                        </div>

                        <button className="bg-[#d4a017] text-white text-sm px-6 py-2 rounded-full font-medium hover:bg-[#b8941a] transition-colors">
                          {t('add')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          )
        ))}

      </div>
    </DashboardContainer>
  );
}