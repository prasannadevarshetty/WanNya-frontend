"use client";

import { useState } from "react";
import PackSelector from "./PackSelector";
import AddToCartBar from "./AddToCartBar";
import { ArrowLeft, Heart, Share2, Star } from "lucide-react";
import { resolveImageUrl, PLACEHOLDER_IMAGE, getProductImage } from "@/lib/image";

export default function ProductDetails({ product }: any) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  return (
    <div>

      {/* IMAGE */}
      <div className="relative">
        <img
          src={getProductImage(product)}
          className="w-full h-[350px] object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />

        <div className="absolute top-5 left-5 bg-white rounded-full p-3 shadow">
          <ArrowLeft size={20} />
        </div>

        <div className="absolute top-5 right-16 bg-white rounded-full p-3 shadow">
          <Heart size={20} />
        </div>

        <div className="absolute top-5 right-5 bg-white rounded-full p-3 shadow">
          <Share2 size={20} />
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-6 space-y-5">

        <div className="bg-white rounded-xl p-5 flex justify-between items-center shadow">
          <div>
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-yellow-600 font-bold text-xl">
              ¥{selectedSize.price.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={18} fill="currentColor" />
            {product.rating}
          </div>
        </div>

        <PackSelector
          sizes={product.sizes}
          selected={selectedSize}
          setSelected={setSelectedSize}
        />
      </div>

      <AddToCartBar />
    </div>
  );
}