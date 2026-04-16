"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  subtitle?: string;
};

export default function AuthHeader({ subtitle }: Props) {
   const router = useRouter();

  return (
    <div className="relative text-center">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute left-0 top-2 bg-white p-3 rounded-full shadow"
      >
        <ArrowLeft className="w-5 h-5 text-[#d4a017]" />
      </button>

      <img
        src="/logo.png"
        alt="WanNya"
        className="mx-auto w-36"
      />
      {subtitle &&(
      <h2 className="mt-4 text-xl font-bold text-[#d4a017]">
        {subtitle}
      </h2>
      )}
    </div>
  );
}
