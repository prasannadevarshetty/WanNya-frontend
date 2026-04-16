import Link from "next/link";

export default function SimilarProducts({ products }: any) {
  return (
    <div className="p-6">

      <h3 className="font-semibold text-lg mb-4">
        Similar products:
      </h3>

      <div className="grid grid-cols-2 gap-4">

        {products.map((p: any) => (
          <Link
            key={p.id}
            href={`/shop/${p.id}`}
            className="bg-white rounded-xl shadow p-3"
          >
            <img
              src={p.image}
              className="w-full h-28 object-cover rounded-lg"
            />

            <h4 className="mt-2 text-sm font-semibold">
              {p.name}
            </h4>

            <p className="text-yellow-600 font-semibold">
              ¥{p.price}
            </p>

            <button className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">
              Add
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}