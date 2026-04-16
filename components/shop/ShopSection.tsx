"use client";

import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/dashboard/ProductCard";
import { Product } from "./ProductDetails";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type Props = {
  title: string;
  products: Product[];
  onViewMore?: () => void;
};

export default function ShopSection({
  title,
  products,
  onViewMore,
}: Props) {

const t = useTranslations("shop");
  
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-[#1f2937]">
          {title}
        </h3>

        {onViewMore && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onViewMore}
            className="
              flex items-center gap-1
              text-[#d4a017]
              font-semibold
              text-sm
            "
          >
            {t("viewMore")}
            <ArrowRight size={16} />
          </motion.button>
        )}
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <div key={product.id} className="min-w-[220px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
