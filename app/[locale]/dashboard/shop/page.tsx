"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import ProductCard from "@/components/dashboard/ProductCard";
import { ArrowRight } from "lucide-react";
import PetInfoCard from "@/components/dashboard/PetInfoCard";
import { productsAPI } from "@/services/api";
import { motion } from "framer-motion";
import { useSearchStore } from "@/store/useSearchStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getRecommendedProducts } from "@/lib/productRecommendations";
import { useTranslations } from "next-intl";

export default function ShopPage() {
  const router = useRouter();
  const { setFilters, setQuery } = useSearchStore();
  const t = useTranslations('shop');

  const handleViewMore = (category: string) => {
    setQuery("");
    setFilters({ category });
    setTimeout(() => {
      router.push("/search");
    }, 200);
  };

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pets, selectedPetId } = useProfileStore();

  useEffect(() => {
    productsAPI.getProducts()
      .then((data) => {
        const allProducts = Array.isArray(data) ? data : data.data || data.products || [];
        
        // Apply smart recommendation algorithm
        const recommendations = getRecommendedProducts(allProducts, pets || [], selectedPetId || undefined);
        const recommendedProducts = recommendations.map(rec => rec.product);
        
        setProducts(recommendedProducts);
        console.log('Shop smart recommendations applied:', recommendations.slice(0, 3).map(r => ({
          name: r.product.name,
          score: r.score,
          reasons: r.reasons
        })));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [pets, selectedPetId]);

  const foods = products.filter(p => p.category?.toLowerCase() === "foods" || p.category?.toLowerCase() === "food");
  const toys = products.filter(p => p.category?.toLowerCase() === "toys" || p.category?.toLowerCase() === "toy");
  const supplements = products.filter(p => p.category?.toLowerCase() === "supplements" || p.category?.toLowerCase() === "supplement");

  if (isLoading) {
    return (
      <DashboardContainer>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-[#d4a017] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Pet Info Card */}
      <div className="max-w-[1000px]">
        <PetInfoCard />
      </div>
      {/* Foods */}
      <section className="mb-8 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-[#1f2937]">
            {t('foods')}
          </h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => handleViewMore("foods")}
            className="flex items-center gap-1 text-[#d4a017] font-semibold text-sm"
          >
            {t('viewMore')} <ArrowRight size={16} />
          </motion.button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {foods.map((p, index) => (
            <div key={p.id || p._id || index} className="min-w-[220px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Toys */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-[#1f2937]">
            {t('toys')}
          </h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => handleViewMore("toys")}
            className="flex items-center gap-1 text-[#d4a017] font-semibold text-sm"
          >
            {t('viewMore')} <ArrowRight size={16} />
          </motion.button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {toys.map((p, index) => (
            <div key={p.id || p._id || index} className="min-w-[220px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Supplements */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-[#1f2937]">
            {t('supplements')}
          </h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => handleViewMore("supplements")}
            className="flex items-center gap-1 text-[#d4a017] font-semibold text-sm"
          >
            {t('viewMore')} <ArrowRight size={16} />
          </motion.button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {supplements.map((p, index) => (
            <div key={p.id || p._id || index} className="min-w-[220px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </DashboardContainer>
  );
}