import type { PetType } from "@/store/useOnboardingStore";


type PetAvatarProps = {
  pet: PetType;
  hasError?: boolean;
  onChange: (pet: PetType) => void;
};

export default function PetAvatar({
  pet,
  hasError = false,
  onChange,
}: PetAvatarProps): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        type="button"
        onClick={() => onChange("dog")}
        className="
          text-3xl font-bold text-[#b88a00]
          w-10 h-10 flex items-center justify-center
          rounded-full
          hover:bg-[#f5e7b8]
          transition
        "
      >
        ‹
      </button>

      <div
        className={`
          h-44 w-44 rounded-full flex items-center justify-center transition
          ${hasError ? "ring-2 ring-red-500" : "bg-[#f2c94c]"}
        `}
      >
        <img
          src={`/icons/${pet}.svg`}
          alt={pet}
          className="h-20 w-20"
        />
      </div>

      <button
        type="button"
        onClick={() => onChange("cat")}
        className="
          text-3xl font-bold text-[#b88a00]
          w-10 h-10 flex items-center justify-center
          rounded-full
          hover:bg-[#f5e7b8]
          transition
        "
      >
        ›
      </button>
    </div>
  );
}