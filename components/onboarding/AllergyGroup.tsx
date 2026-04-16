type AllergyGroupProps = {
  items: string[];
  values: string[];
  setValues: (value: string) => void; // 👈 IMPORTANT
};

export default function AllergyGroup({
  items,
  values,
  setValues,
}: AllergyGroupProps): JSX.Element {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {items.map((item) => {
        const selected = values.includes(item);

        return (
          <button
            key={item}
            type="button"
            onClick={() => setValues(item)} // 👈 single value
            className={`
              px-4 py-2 rounded-full border font-medium transition
              ${
                selected
                  ? "bg-[#d4a017] text-white border-[#d4a017]"
                  : "bg-white text-[#d4a017] border-[#d4a017]"
              }
            `}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}