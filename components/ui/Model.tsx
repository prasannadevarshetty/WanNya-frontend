"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: Props) {
  const [mounted, setMounted] = useState(false);

  // Fix for SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-3xl bg-white shadow-2xl p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 mb-6">
            {subtitle}
          </p>
        )}

        {/* Content */}
        {children}
      </div>
    </div>,
    document.body
  );
}