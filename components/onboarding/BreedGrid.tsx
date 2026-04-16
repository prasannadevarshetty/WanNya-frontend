"use client";

import { useTranslations } from "next-intl";

type Props = {
  petType: "dog" | "cat";
  selected: string;
  onSelect: (value: string) => void;
};

// ✅ Use stable keys (NOT UI text)
const DOG_BREEDS = [
  "labradorRetriever",
  "germanShepherd",
  "goldenRetriever",
  "frenchBulldog",
  "bulldog",
  "poodle",
  "beagle",
  "rottweiler",
];

const CAT_BREEDS = [
  "persian",
  "maineCoon",
  "britishShorthair",
  "americanShorthair",
  "ragDoll",
  "bengal",
  "siamese",
  "abyssinian",
];

export default function BreedGrid({ petType, selected, onSelect }: Props) {
  const t = useTranslations("popularBreeds");

  const breeds = petType === "cat" ? CAT_BREEDS : DOG_BREEDS;
  const namespace = petType === "cat" ? "catBreeds" : "dogBreeds";

  return (
    <div className="grid grid-cols-2 gap-3">
      {breeds.map((key) => {
        const label = t(`${namespace}.${key}`);

        return (
          <button
            key={key}
            onClick={() => onSelect(key)} // ✅ store key, not label
            className={`
              px-4 py-2 rounded-lg border text-sm font-medium transition-colors
              ${
                selected === key
                  ? "bg-[#d4a017] text-white border-[#d4a017]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
