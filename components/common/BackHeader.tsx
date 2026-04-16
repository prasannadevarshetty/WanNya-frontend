"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
};

export default function BackHeader({ title }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => router.back()}
        className="w-10 h-10 rounded-full bg-[#fde68a] flex items-center justify-center"
      >
        <ArrowLeft className="text-[#d4a017]" />
      </button>

      <h2 className="text-xl font-bold text-[#d4a017]">
        {title}
      </h2>
    </div>
  );
}