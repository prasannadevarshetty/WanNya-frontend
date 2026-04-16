"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const options = ["Vegetarian", "Non-Vegetarian", "Raw Food", "Mixed"];

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function DietDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-4">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full px-6 py-4
          rounded-full border-2 border-[#d4a017]
          bg-[#fff1b8]
          flex items-center justify-between
          text-lg font-semibold
        "
      >
        <span className={value ? "text-black" : "text-gray-500"}>
          {value || "Select Diet type"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#d4a017] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-20 mt-2 w-full
            rounded-2xl border-2 border-[#d4a017]
            bg-[#fff9ec]
            shadow-xl overflow-hidden
          "
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`
                w-full px-6 py-4 flex items-center justify-between
                text-left text-lg
                hover:bg-[#fff1b8]
                ${value === opt ? "font-bold text-[#d4a017]" : ""}
              `}
            >
              {opt}
              {value === opt && (
                <Check className="w-5 h-5 text-[#d4a017]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
