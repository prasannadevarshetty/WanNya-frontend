type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
};

export default function TermsCheckbox({ checked, onChange }: Props) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 accent-[#d4a017]"
      />

      <p className="text-[#d4a017]">
        I agree to the{" "}
        <span className="underline font-semibold">Terms of Service</span> and{" "}
        <span className="underline font-semibold">Privacy Policy</span>
        <br />
        <span className="text-gray-600">
          We protect your pet’s data with care and love
        </span>
      </p>
    </div>
  );
}
