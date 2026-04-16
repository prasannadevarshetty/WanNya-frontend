import { notFound } from "next/navigation";
import ProductDetails from "@/components/shop/ProductDetails";
import { productsAPI } from "@/services/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  try {
    const data = await productsAPI.getProduct(id);
    const product = data?.product;

    if (!product) {
      return notFound();
    }

    // Fetch similar products based on the current product's category
    const similarData = await productsAPI.getProducts({ 
      category: product.category, 
      limit: "3" 
    });
    
    // Convert out the same product ID being featured in similar products
    const similarProducts = (similarData?.products || [])
      .filter((p: any) => p._id !== product._id && p.id !== product.id)
      .slice(0, 2);

    return (
      <ProductDetails
        product={product}
        similarProducts={similarProducts}
      />
    );
  } catch (error) {
    console.error("Failed to load product page:", error);
    return notFound();
  }
}