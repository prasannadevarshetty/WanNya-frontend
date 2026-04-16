"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

export default function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block mb-2 text-[#d4a017] font-semibold">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-4 rounded-xl
            bg-[#fff1b8]
            border-2
            ${error ? "border-red-400" : "border-[#d4a017]"}
            focus:outline-none
          `}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
