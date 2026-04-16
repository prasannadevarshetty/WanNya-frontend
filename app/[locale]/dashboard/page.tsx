"use client";

import { useState, useEffect } from "react";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import PetInfoCard from "@/components/dashboard/PetInfoCard";
import ProductCard from "@/components/dashboard/ProductCard";
import PawPrintLoader from "@/components/ui/PawPrintLoader";
import { productsAPI } from "@/services/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store/useSearchStore";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getRecommendedProducts } from "@/lib/productRecommendations";
import { useTranslations } from "next-intl";

type Product = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  rating?: number;
  duration?: string;
};

export default function DashboardHome() {
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

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const { user, loadProfile, pets, selectedPetId } = useProfileStore();

  useEffect(() => {
    if (token) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [token, pets, selectedPetId]);

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [token, loadProfile]);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getProducts();
      const allProducts = data?.products || [];
      
      // Apply smart recommendation algorithm
      const recommendations = getRecommendedProducts(allProducts, pets || [], selectedPetId || undefined);
      const recommendedProducts = recommendations.map(rec => rec.product);
      
      setProducts(recommendedProducts);
      console.log('🔄 Smart recommendations updated for pet:', {
        selectedPetId,
        petType: pets?.find(p => p.id === selectedPetId)?.type,
        totalProducts: recommendedProducts.length
      });
      console.log('Smart recommendations applied:', recommendations.slice(0, 3).map(r => ({
        name: r.product.name,
        score: r.score,
        reasons: r.reasons
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const foods = products.filter((p) => p.category?.toLowerCase() === "foods" || p.category?.toLowerCase() === "food");
  const toys = products.filter((p) => p.category?.toLowerCase() === "toys" || p.category?.toLowerCase() === "toy");
  const supplements = products.filter((p) => p.category?.toLowerCase() === "supplements" || p.category?.toLowerCase() === "supplement");

  if (loading) {
    return (
      <DashboardContainer>
        <div className="flex justify-center items-center h-64">
          <PawPrintLoader />
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Pet Info Card */}
      <div className="w-full max-w-[1000px] mx-auto">
        <PetInfoCard />
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-6">
        {t('recommended')}
      </h2>

      {/* Foods */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{t('foods')}</h3>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleViewMore("foods")}
          className="flex items-center gap-1 text-[#d4a017] font-semibold text-sm"
        >
          {t('viewMore')} <ArrowRight size={16} />
        </motion.button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {foods.map((p) => (
          <ProductCard key={p.id || p._id} product={p} />
        ))}
      </div>

      {/* Toys */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{t('toys')}</h3>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleViewMore("toys")}
          className="flex items-center gap-1 text-[#d4a017] font-semibold text-sm"
        >
          {t('viewMore')} <ArrowRight size={16} />
        </motion.button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {toys.map((p) => (
          <ProductCard key={p.id || p._id} product={p} />
        ))}
      </div>

      {/* Supplements */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{t('supplements')}</h3>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleViewMore("supplements")}
          className="flex items-center gap-1 text-[#d4a017] font-semibold text-sm"
        >
          {t('viewMore')} <ArrowRight size={16} />
        </motion.button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {supplements.map((p) => (
          <ProductCard key={p.id || p._id} product={p} />
        ))}
      </div>
    </DashboardContainer>
  );
}