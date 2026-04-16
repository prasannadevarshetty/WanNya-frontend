"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { useSearchStore } from "@/store/useSearchStore";
import SearchSuggestions from "@/components/search/SearchSuggestions";
import SearchChips from "@/components/search/SearchChips";
import { useTranslations } from "next-intl";
import { productsAPI } from "@/services/api";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('search');
  const debounced = useDebounce(input);
  const { setQuery, addRecentSearch } = useSearchStore();
  const router = useRouter();

  useEffect(() => {
    if (!debounced.trim()) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    
    // Use the search endpoint for suggestions
    productsAPI.searchProducts(debounced)
      .then((data) => {
        const fetchedProducts = Array.isArray(data) ? data : data?.products || [];

        const names = Array.from(new Set(fetchedProducts.map((p: { name: string }) => p.name)));
        setSuggestions(names.slice(0, 5) as string[]);
      })
      .catch((error) => {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      })
      .finally(() => {
        setIsLoadingSuggestions(false);
      });
  }, [debounced]);

  const handleSearch = (value: string): void => {
    if (!value.trim()) return;
    addRecentSearch(value);
    setQuery(value);
    setInput("");
    setIsFocused(false);
    setIsMobileOpen(false);
    router.push("/search");
  };

  const handleClear = (): void => {
    setInput("");
    inputRef.current?.focus();
  };

  const openMobile = (): void => {
    setIsMobileOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const closeMobile = (): void => {
    setIsMobileOpen(false);
    setInput("");
  };

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="flex md:hidden justify-end w-full">
        <button 
          onClick={openMobile} 
          aria-label="Open search"
          className="p-2 rounded-full hover:bg-[#fff1b8] active:bg-[#fde68a] transition-colors"
        >
          <Search size={24} className="text-[#d4a017]" />
        </button>
      </div>

      {/* Desktop Search or Mobile Fullscreen Overlay */}
      <div
        className={`${isMobileOpen
            ? "fixed inset-0 z-50 bg-[#fff9ec] p-4 flex flex-col pt-[max(env(safe-area-inset-top),_16px)]"
            : "hidden md:block relative w-full z-40"
          }`}
      >
        {isMobileOpen && (
          <div className="flex items-center gap-3 mb-6 md:hidden">
            <button 
              onClick={closeMobile} 
              className="text-[#d4a017] p-2 -ml-2 rounded-full hover:bg-[#fff1b8] active:bg-[#fde68a] transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-[#3d2f00]">t("title")</h2>
          </div>
        )}

        <div className="relative w-full">

          {/* INPUT ROW */}
          <div
            className={`flex items-center bg-[#fff1b8] border-2 rounded-full px-4 py-3 transition-all ${isFocused ? "border-[#c9940f] shadow-[0_0_0_3px_#fde68a55]" : "border-[#d4a017]"
              }`}
          >
            <input
              ref={inputRef}
              id="search-input"
              name="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)} // delay so click registers
              onKeyDown={(e) => e.key === "Enter" && handleSearch(input)}
              placeholder={t("foodsearch")}
              className="flex-1 bg-transparent outline-none text-base md:text-sm text-[#3d2f00] placeholder:text-[#c4a24a]"
              aria-label="Search products"
              role="searchbox"
            />

            {/* Clear button — only when typing */}
            {input && (
              <button
                onClick={handleClear}
                className="text-[#c4a24a] p-1 rounded-full hover:bg-[#fde68a] active:bg-[#fbbf24] transition-colors mr-2 shrink-0"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

            <button
              onClick={() => handleSearch(input)}
              className="text-[#d4a017] p-1 rounded-full hover:bg-[#fde68a] active:bg-[#fbbf24] transition-colors shrink-0"
              aria-label="Submit search"
            >
              <Search size={18} />
            </button>
          </div>

          {/* SUGGESTIONS DROPDOWN */}
          {isFocused && (
            <SearchSuggestions
              suggestions={suggestions}
              query={debounced}
              onSelect={handleSearch}
              isLoading={isLoadingSuggestions}
            />
          )}
        </div>

        {/* Recent searches for mobile */}
        {isMobileOpen && (
          <div className="mt-6 md:hidden">
            <SearchChips onChipClick={(term: string) => {
              handleSearch(term);
              closeMobile();
            }} />
          </div>
        )}
      </div>
    </>
  );
}
