"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const diets = ["Vegetarian", "Non-Vegetarian", "Raw Food", "Mixed"];

export default function DietSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-4">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full px-6 py-4
          rounded-full border-2 border-[#d4a017]
          bg-[#fff1b8]
          flex items-center justify-between
          text-lg font-semibold
          focus:outline-none
        "
      >
        <span className={value ? "text-black" : "text-gray-500"}>
          {value || "Select Diet type"}
        </span>

        <ChevronDown
          className={`w-5 h-5 text-[#d4a017] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-30 mt-2 w-full
            rounded-2xl border-2 border-[#d4a017]
            bg-[#fff9ec]
            shadow-xl overflow-hidden
          "
        >
          {diets.map((diet) => (
            <button
              key={diet}
              type="button"
              onClick={() => {
                onChange(diet);
                setOpen(false);
              }}
              className={`
                w-full px-6 py-4
                flex items-center justify-between
                text-left text-lg
                hover:bg-[#fff1b8]
                transition
                ${
                  value === diet
                    ? "font-bold text-[#d4a017]"
                    : "text-black"
                }
              `}
            >
              {diet}
              {value === diet && (
                <Check className="w-5 h-5 text-[#d4a017]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
