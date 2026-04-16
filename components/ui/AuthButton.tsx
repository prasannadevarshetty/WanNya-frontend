"use client";

import clsx from "clsx";
import React from "react";
import { PawPrint } from "lucide-react";

type AuthButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  showIcon?: boolean;
  className?: string;
};

export default function AuthButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  showIcon = false,
  className,
}: AuthButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full max-w-[450px] h-[60px]", // 👈 only this line changed
        "rounded-full",
        "flex items-center justify-center gap-2",

        "text-lg font-semibold",

        "transition-all active:scale-95",
        "disabled:opacity-60 disabled:cursor-not-allowed",

        variant === "primary" &&
          "bg-gradient-to-r from-[#f1b800] to-[#d4a017] text-white shadow-lg",

        variant === "secondary" &&
          "bg-[#fff1b8] border-2 border-[#d4a017] text-[#d4a017] shadow-none",

        className
      )}
    >
      {showIcon && <PawPrint className="w-5 h-5" />}
      {children}
    </button>
  );
}