"use client";

import { useCartStore } from "@/store/useCartStore";
import Button from "@/components/ui/Button";
import { Star } from "lucide-react";
import Link from "next/link";
import { resolveImageUrl, PLACEHOLDER_IMAGE, getProductImage } from "@/lib/image";

type Props = {
  product: {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    image?: string;
    images?: string[];
    rating?: number;
    duration?: string;
  };
};

export default function ProductCard({ product }: Props) {
  const cartStore = useCartStore();
  const productId = product.id || product._id;

  const productImage = getProductImage(product);

  return (
    <Link href={`/dashboard/shop/${productId}`}>
      <div className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition">

        <img
          src={productImage}
          alt={product.name}
          className="rounded-lg h-32 w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== PLACEHOLDER_IMAGE) {
              target.src = PLACEHOLDER_IMAGE;
            }
          }}
        />

        <h4 className="font-semibold mt-2">
          {product.name}
        </h4>

        <p className="text-lg font-bold mt-1">
          ¥{product.price}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-semibold">
              {product.rating}
            </span>
          </div>

          <Button
            className="h-8 px-4 text-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!productId) return;

              cartStore.addItem({
                id: productId,
                name: product.name,
                title: product.name,
                price: product.price,
                image: productImage,
                category: 'product',
                rating: product.rating || 0,
                duration: product.duration,
              });
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}