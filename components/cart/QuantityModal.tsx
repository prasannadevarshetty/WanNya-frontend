"use client";

import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import { resolveImageUrl, PLACEHOLDER_IMAGE } from "@/lib/image";

type Props = {
  open: boolean;
  onClose: () => void;
  product: any;
  onConfirm: (quantity: number) => void;
};

export default function QuantityModal({
  open,
  onClose,
  product,
  onConfirm,
}: Props) {

  const [quantity, setQuantity] = useState(1);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
    >

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-[320px] shadow-xl"
      >

        <h2 className="text-lg font-semibold mb-4">
          Select Quantity
        </h2>

        <div className="flex items-center gap-3">

          <img
            src={resolveImageUrl(product?.image) || PLACEHOLDER_IMAGE}
            className="w-14 h-14 rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />

          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-[#d4a017] font-bold">
              ¥{product.price}
            </p>
          </div>

        </div>

        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
        />

        <button
          onClick={() => {
            onConfirm(quantity);
            onClose();
          }}
          className="w-full mt-6 bg-[#d4a017] text-white py-3 rounded-xl font-semibold"
        >
          Add to Cart
        </button>

      </div>

    </div>
  );
}