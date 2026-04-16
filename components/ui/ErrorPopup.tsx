"use client";

type ErrorPopupProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export default function ErrorPopup({
  open,
  message,
  onClose,
}: ErrorPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-[90%] max-w-md rounded-3xl bg-[#fff1b8] border-4 border-[#d4a017] p-6 text-center shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#d4a017] text-2xl font-bold"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-[#d4a017] mb-4">
          Error
        </h2>

        {/* Message */}
        <p className="text-red-600 font-semibold leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}