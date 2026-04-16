"use client";

import Button from "@/components/ui/Button";
import { MapPin } from "lucide-react";

type Props = {
  onAdd: () => void;
};

export default function EmptyAddresses({ onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">

      {/* Icon */}
      <div className="bg-yellow-100 p-4 rounded-full mb-4">
        <MapPin className="text-yellow-500" size={28} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800">
        No addresses yet
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 mt-1 max-w-xs">
        Add your delivery address to get your pet’s meals on time.
      </p>

      {/* CTA */}
      <Button
        onClick={onAdd}
        className="mt-5 px-6 py-2 rounded-full bg-yellow-400 text-black font-semibold shadow hover:scale-105 transition"
      >
        Add Address
      </Button>

    </div>
  );
}