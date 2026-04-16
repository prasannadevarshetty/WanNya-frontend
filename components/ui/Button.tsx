"use client";

import clsx from "clsx";
import { PawPrint } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

// Inline paw print loader for buttons
function InlinePawLoader() {
  return (
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  onClick,
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const t = useTranslations('general');

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        "inline-flex items-center justify-center",
        "rounded-full font-semibold",
        "transition-all duration-200",
        "active:scale-95 hover:brightness-105",

        isDisabled && "opacity-60 cursor-not-allowed",

        variant === "primary" &&
          "bg-gradient-to-r from-[#f1b800] to-[#d4a017] text-white shadow-lg",
        variant === "secondary" &&
          "bg-gradient-to-r from-[#fff1b8] to-[#ffe6a3] border-2 border-[#d4a017] text-[#d4a017] shadow-md",

        "px-5 py-2 text-sm",

        className
      )}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <InlinePawLoader />
        ) : (
          <PawPrint className="w-4 h-4" />
        )}

        <span>{loading ? t('pleaseWait') : children}</span>
      </div>
    </button>
  );
}