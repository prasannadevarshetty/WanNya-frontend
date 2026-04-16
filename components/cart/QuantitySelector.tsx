"use client";

type Props = {
  quantity: number;
  setQuantity: (q: number) => void;
};

export default function QuantitySelector({ quantity, setQuantity }: Props) {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">

      <button
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold flex items-center justify-center shrink-0"
      >
        -
      </button>

      <span className="text-base font-semibold w-5 text-center shrink-0">
        {quantity}
      </span>

      <button
        onClick={() => setQuantity(quantity + 1)}
        className="w-8 h-8 rounded-full bg-[#d4a017] text-white text-lg font-bold flex items-center justify-center shrink-0"
      >
        +
      </button>

    </div>
  );
}