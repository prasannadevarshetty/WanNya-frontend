"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  length?: number;
  value: string[];
  onChange: (v: string[]) => void;
  onComplete?: (otp: string) => void;
  onResend?: () => void;
  hasError?: boolean;
};

export default function OtpInput({
  length = 5,
  value,
  onChange,
  onComplete,
  onResend,
  hasError,
}: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ---------------- Countdown ---------------- */
  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleResend = () => {
    if (!canResend) return;
    setSeconds(30);
    setCanResend(false);
    onResend?.();
  };

  /* ---------------- Auto Submit (once) ---------------- */
  useEffect(() => {
    if (
      !submitted &&
      value.every((digit) => digit !== "")
    ) {
      setSubmitted(true);
      onComplete?.(value.join(""));
    }
  }, [value, submitted, onComplete]);

  /* Reset submit flag when OTP changes */
  useEffect(() => {
    if (value.some((digit) => digit === "")) {
      setSubmitted(false);
    }
  }, [value]);

  /* ---------------- Shake Animation ---------------- */
  useEffect(() => {
    if (hasError) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }, [hasError]);

  /* ---------------- Input Handlers ---------------- */
  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newValue = [...value];
    newValue[index] = val;
    onChange(newValue);

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (!value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    const newValue = pasteData.split("");
    while (newValue.length < length) newValue.push("");
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`flex justify-center gap-4 ${
          shake ? "animate-shake" : ""
        }`}
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={value[i] || ""}
            maxLength={1}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => e.key === "Backspace" && handleBackspace(i)}
            onPaste={handlePaste}
            className="
              w-14 h-14 rounded-full
              text-center text-xl font-bold
              bg-[#fff1b8]
              border-2 border-[#d4a017]
              focus:outline-none
            "
          />
        ))}
      </div>

      <div className="text-sm text-gray-600">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-[#d4a017] font-semibold hover:underline"
          >
            Resend OTP
          </button>
        ) : (
          <span>Resend OTP in {seconds}s</span>
        )}
      </div>
    </div>
  );
}