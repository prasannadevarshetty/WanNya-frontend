"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PetType } from "@/store/useOnboardingStore";
import { apiRequest } from "@/services/api";

type BreedSearchInputProps = {
  value: string;
  petType: PetType;
  error?: boolean;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export default function BreedSearchInput({
  value,
  petType,
  error = false,
  onChange,
  onClear,
}: BreedSearchInputProps): JSX.Element {
  const t = useTranslations("popularBreeds");

  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [catBreeds, setCatBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/api/pets/breeds");
        setDogBreeds(response.dogBreeds || []);
        setCatBreeds(response.catBreeds || []);
      } catch (err) {
        console.error("Failed to fetch breeds:", err);

        // ✅ i18n fallback
        setDogBreeds([
          t("dogBreeds.labradorRetriever"),
          t("dogBreeds.germanShepherd"),
          t("dogBreeds.goldenRetriever"),
          t("dogBreeds.frenchBulldog"),
          t("dogBreeds.bulldog"),
          t("dogBreeds.poodle"),
          t("dogBreeds.beagle"),
          t("dogBreeds.rottweiler"),
        ]);

        setCatBreeds([
          t("catBreeds.persian"),
          t("catBreeds.maineCoon"),
          t("catBreeds.britishShorthair"),
          t("catBreeds.americanShorthair"),
          t("catBreeds.ragdoll"), // ✅ fixed key
          t("catBreeds.bengal"),
          t("catBreeds.siamese"),
          t("catBreeds.abyssinian"),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, [t]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const breeds = petType === "cat" ? catBreeds : dogBreeds;
  const uniqueBreeds = Array.from(new Set(breeds));
  const normalizedSearch = value.trim().toLowerCase();

  const filteredBreeds = normalizedSearch
    ? uniqueBreeds.filter((breed) =>
        breed.toLowerCase().includes(normalizedSearch)
      )
    : uniqueBreeds;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search icon */}
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={`${t("search")} ${petType} ${t("breed")}`}// ✅ translated dog/cat
        
        className={`
          h-11 w-full rounded-xl border pl-11 pr-10 outline-none transition
          ${
            error
              ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-400"
              : "border-gray-300 focus:ring-2 focus:ring-[#f2c94c]"
          }
        `}
      />

      {/* Clear */}
      {value && onClear && (
        <button
          type="button"
          onClick={() => {
            onClear();
            setIsOpen(true);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && normalizedSearch && !loading && filteredBreeds.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto top-full">
          {filteredBreeds.slice(0, 40).map((breed, idx) => (
            <button
              key={`${breed}-${idx}`}
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#f2c94c] hover:bg-opacity-20 transition-colors"
              onClick={() => {
                onChange(breed);
                setIsOpen(false);
              }}
            >
              {breed}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
