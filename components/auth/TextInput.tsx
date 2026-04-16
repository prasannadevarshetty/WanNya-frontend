type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  error,
}: Props) {
  return (
    <div>
      <label className="block mb-2 text-[#d4a017] font-semibold">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-4 rounded-xl
          bg-[#fff1b8]
          border-2
          ${error ? "border-red-400" : "border-[#d4a017]"}
          focus:outline-none
        `}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}