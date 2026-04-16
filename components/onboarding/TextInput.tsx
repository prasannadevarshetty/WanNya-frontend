type TextInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  error?: boolean | string;
  onChange: (value: string) => void; // ✅ STRING, not event
};

export default function TextInput({
  label,
  value,
  placeholder,
  error = false,
  onChange,
}: TextInputProps): JSX.Element {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} // ✅ convert event → string
        className={`
          h-11 rounded-xl border px-4 outline-none transition
          ${
            hasError
              ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-400"
              : "border-[#be9c3d] bg-white focus:ring-2 focus:ring-[#f2c94c]"
          }
        `}
      />
    </div>
  );
}