type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function BreedPill({ label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-4 rounded-2xl border-2
        font-semibold
        ${
          selected
            ? "bg-[#fff1b8] border-[#d4a017] text-black"
            : "bg-white border-[#d4a017] text-black"
        }
      `}
    >
      {label}
    </button>
  );
}
