type Props = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export default function CheckboxItem({ label, checked, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3"
    >
      <div
        className={`
          w-6 h-6 rounded-md border-2 flex items-center justify-center
          ${checked ? "bg-[#fff1b8] border-[#d4a017]" : "bg-white border-black"}
        `}
      >
        {checked && <div className="w-3 h-3 bg-[#d4a017] rounded-sm" />}
      </div>
      <span className="text-lg font-semibold">{label}</span>
    </button>
  );
}
