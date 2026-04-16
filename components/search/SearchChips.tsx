"use client";

import { Clock, X } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";

interface SearchChipsProps {
  onChipClick: (term: string) => void;
}

export default function SearchChips({ onChipClick }: SearchChipsProps) {
  const { recentSearches, removeRecentSearch } = useSearchStore();

  if (recentSearches.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} className="text-[#9c7000]" />
        <p className="text-xs text-[#9c7000] font-medium">Recent searches</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((term) => (
          <div
            key={term}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#d4a017] bg-[#fff8d6] text-[#9c7000] text-sm transition-all hover:bg-[#ffe9a8] hover:border-[#c9940f] active:scale-95"
          >
            {/* Clicking the label fills the search */}
            <button
              className="flex-1 text-left font-medium"
              onClick={() => onChipClick(term)}
            >
              {term}
            </button>

            {/* Clicking ✕ removes just this chip */}
            <button
              onClick={() => removeRecentSearch(term)}
              className="opacity-50 hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-[#fde68a]"
              aria-label={`Remove ${term} from recent searches`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}