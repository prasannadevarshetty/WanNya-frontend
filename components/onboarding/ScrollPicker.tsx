type Props = {
  items: string[];
  value: string;
  onChange: (v: string) => void;
};

export default function ScrollPicker({ items, value, onChange }: Props) {
  return (
    <div className="h-48 overflow-y-scroll no-scrollbar">
      <div className="flex flex-col items-center gap-4 py-20">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`
              w-24 py-3 rounded-xl border-2 text-lg font-semibold
              ${
                value === item
                  ? "bg-[#fff1b8] border-[#d4a017]"
                  : "bg-white border-[#d4a017]/40"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
