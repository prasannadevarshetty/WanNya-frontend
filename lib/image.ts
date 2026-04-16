export const PLACEHOLDER_IMAGE = "/brands/dog-food.png";

// Use the same API base URL as the services
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

export function resolveImageUrl(img: string | null | undefined): string | null {
  if (!img) return null;
  if (typeof img !== "string") return null;
  
  // If it's already a full URL, return as-is
  if (img.startsWith("http")) return img;
  
  // If it starts with /, it's already a valid path
  if (img.startsWith("/")) return `${API_BASE_URL}${img}`;
  
  // For database images, try different possible path formats
  // Format 1: Just filename (e.g., "dog-food.jpg")
  // Format 2: With uploads (e.g., "uploads/images/dog-food.jpg")
  // Format 3: With api prefix (e.g., "api/uploads/images/dog-food.jpg")
  
  // Try common backend patterns
  const possiblePaths = [
    `/uploads/images/${img}`,           // Standard uploads
    `/api/uploads/images/${img}`,       // API route
    `/uploads/${img}`,                  // Direct uploads
    `/api/uploads/${img}`,              // API direct uploads
    img,                                 // As-is (might already include path)
  ];
  
  // If img already includes uploads, try it with base URL
  if (img.includes("uploads/")) {
    possiblePaths.unshift(`/${img}`);   // e.g., /uploads/images/dog-food.jpg
  }
  
  // Return the first format, we'll let the browser handle 404s
  return `${API_BASE_URL}${possiblePaths[0]}`;
}

// Helper function to get a reliable image URL with fallback
export function getProductImage(product: { image?: string; images?: string[]; imageUrl?: string } | null | undefined): string {
  if (!product) return PLACEHOLDER_IMAGE;
  
  // Try multiple possible image fields in order of preference
  const rawImage = product.imageUrl || product.image || (product.images && product.images.length > 0 ? product.images[0] : null);
  const resolved = resolveImageUrl(rawImage);
  
  // Debug logging - remove in production
  if (typeof window !== 'undefined') {
    console.log('🖼️ Image Debug:', {
      productName: (product as any).name || 'Unknown',
      rawImage,
      resolved,
      imageUrl: product.imageUrl,
      image: product.image,
      images: product.images,
      placeholder: PLACEHOLDER_IMAGE
    });
  }
  
  // If resolution failed or returns null, use placeholder
  if (!resolved) return PLACEHOLDER_IMAGE;
  
  return resolved;
}

export default resolveImageUrl;
