"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store/useSearchStore";
import SearchChips from "@/components/search/SearchChips";
import EmptySearch from "@/components/search/EmptySearch";
import PawPrintLoader from "@/components/ui/PawPrintLoader";
import { productsAPI } from "@/services/api";
import ProductCard from "@/components/dashboard/ProductCard";
import { useTranslations } from "next-intl";

export default function SearchPage() {
  const router = useRouter();
  const { 
    query, 
    setQuery, 
    addRecentSearch, 
    clearFilters,
    filters,
    setFilters,
    sortOption,
    setSortOption
  } = useSearchStore();

  const hasSearched = query.trim().length > 0;
  const t = useTranslations("search");
  const c = useTranslations("search.categories");
  const s = useTranslations("search.sort");

  const filterCategory = filters.category || "All";

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!hasSearched) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await productsAPI.searchProducts(query);
        const fetchedProducts = Array.isArray(data) ? data : data.products || [];
        
        let filtered = fetchedProducts;

        if (filterCategory !== "All") {
          filtered = filtered.filter((item: any) => item.category === filterCategory);
        }

        filtered.sort((a: any, b: any) => {
          if (sortOption === "price_low") return a.price - b.price;
          if (sortOption === "price_high") return b.price - a.price;
          return 0; 
        });

        setResults(filtered);
      } catch (error) {
        console.error(t("failed"), error);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [query, sortOption, filterCategory, hasSearched]);

  const handleChipClick = (term: string) => {
    addRecentSearch(term);
    setQuery(term);
  };

  const handleClear = () => {
    setQuery("");
    clearFilters();
  };

  return (
    <div className="min-h-screen bg-[#fff9ec] px-4 py-6 md:px-6 lg:px-8">

      {/* HEADER */}
      <div className="sticky top-0 z-30 -mx-4 px-4 pt-2 pb-4 bg-[#fff9ec]/95 backdrop-blur border-b border-[#efe3bf]">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          
          <button
            onClick={() => router.back()}
            className={`w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center ${hasSearched ? "" : "opacity-0 pointer-events-none"}`}
          >
            <ArrowLeft className="text-[#d4a017]" size={18} />
          </button>

          {/* ✅ FIXED placeholder */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center bg-white border-2 border-[#d4a017] rounded-full px-4 py-3">
              <Search size={18} className="text-[#d4a017]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("placeholder")}
                className="flex-1 bg-transparent outline-none px-3"
              />
              {query && (
                <button onClick={handleClear}>
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => router.push('/cart')}
            className={`w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center ${hasSearched ? "" : "opacity-0 pointer-events-none"}`}
          >
            <ShoppingCart className="text-[#d4a017]" size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">

        {!hasSearched && (
          <div className="pt-6">
            <h1 className="text-2xl font-bold">{t("question")}</h1>
            <p className="text-sm mt-2">{t("description")}</p>
            <SearchChips onChipClick={handleChipClick} />
          </div>
        )}

        {hasSearched && (
          <>
            <div className="mb-6 mt-6">

              {/* ✅ FIXED loading text */}
              <div>
                {isLoading ? (
                  <span>{t("loading")}</span>
                ) : (
                  <span>
                    `${t("results.found")} ${results.length} ${t("results.for")} "${query}"`
                  </span>
                )}
              </div>

              {/* ✅ FIXED select translations */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                <option value="relevance">{s("relevance")}</option>
                <option value="price_low">{s("lowToHigh")}</option>
                <option value="price_high">{s("highToLow")}</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilters({ category: e.target.value })}
              >
                <option value="All">{c("all")}</option>
                <option value="foods">{c("food")}</option>
                <option value="toys">{c("toys")}</option>
                <option value="supplements">{c("supplements")}</option>
              </select>
            </div>

            {isLoading ? (
              <PawPrintLoader />
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map((item, index) => (
                  <ProductCard key={item.id || index} product={item} />
                ))}
              </div>
            ) : (
              <EmptySearch onClear={handleClear} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
