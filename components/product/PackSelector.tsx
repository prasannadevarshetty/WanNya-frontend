export default function PackSelector({
  sizes,
  selected,
  setSelected,
}: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <p className="text-gray-600 mb-4 font-medium">Pack Size:</p>

      <div className="flex gap-4">
        {sizes.map((size: any) => (
          <button
            key={size.label}
            onClick={() => setSelected(size)}
            className={`flex-1 border rounded-xl p-4 text-center transition
            ${
              selected.label === size.label
                ? "bg-[#efe3c2] border-[#d6b15d]"
                : "bg-white"
            }`}
          >
            <p className="font-semibold">{size.label}</p>
            <p className="text-sm text-gray-600">
              ¥{size.price.toLocaleString()}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}