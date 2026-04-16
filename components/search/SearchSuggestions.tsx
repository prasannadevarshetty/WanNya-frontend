"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface SearchSuggestionsProps {
  suggestions: string[];
  query: string;
  onSelect: (term: string) => void;
  isLoading?: boolean;
}

export default function SearchSuggestions({
  suggestions,
  query,
  onSelect,
  isLoading = false,
}: SearchSuggestionsProps) {
  if (!query.trim()) return null;

  const t = useTranslations('search');

  return (
    <div className="absolute left-0 right-0 top-full mt-2 w-full bg-white border border-[#ede5c4] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-[9999] overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 px-4 py-6">
          <div className="w-4 h-4 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-[#9c7000]">{t("loading")}</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="max-h-80 overflow-y-auto">
          {suggestions.map((s) => {
            const q = query.toLowerCase();
            const idx = s.toLowerCase().indexOf(q);
            const before = idx >= 0 ? s.slice(0, idx) : s;
            const match = idx >= 0 ? s.slice(idx, idx + query.length) : "";
            const after = idx >= 0 ? s.slice(idx + query.length) : "";

            return (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(s)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#fff8d6] border-b border-[#f5eccc] last:border-none transition-colors active:bg-[#fde68a]"
              >
                <Search size={16} className="text-[#d4a017] shrink-0" />
                <span className="text-sm text-[#3d2f00] flex-1">
                  {before}
                  {match && (
                    <strong className="text-[#d4a017] font-semibold">{match}</strong>
                  )}
                  {after}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-5 text-sm text-[#9c7000] text-center">
          {t("noSuggestions")} &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
