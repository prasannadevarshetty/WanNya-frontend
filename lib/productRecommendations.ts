import { Pet } from '@/types';

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  category: string;
  petType?: string;
  rating?: number;
  image?: string;
  images?: string[];
  description?: string;
  features?: string[];
  tags?: string[];
  inStock?: boolean;
}

export interface RecommendationScore {
  product: Product;
  score: number;
  reasons: string[];
}

/**
 * Smart product recommendation algorithm
 * Ensures cat users don't get dog products and vice versa
 */
export function getRecommendedProducts(
  products: Product[], 
  userPets: Pet[], 
  selectedPetId?: string
): RecommendationScore[] {
  if (!products || products.length === 0) return [];
  
  const activePet = userPets?.find(p => p.id === selectedPetId) || userPets?.[0];
  
  if (!activePet) {
    // No pet info, return all products with neutral score
    return products.map(product => ({
      product,
      score: 0.5,
      reasons: ['No pet preferences set']
    }));
  }
  
  const petType = activePet.type?.toLowerCase();
  const petGender = activePet.gender?.toLowerCase();
  
  // Calculate age from date of birth
  const calculateAge = (dob: { date: string; month: string; year: string }) => {
    const birthDate = new Date(`${dob.year}-${dob.month}-${dob.date}`);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return ageInYears - 1;
    }
    return ageInYears;
  };
  
  const petAge = activePet.dob ? calculateAge(activePet.dob) : null;
  
  return products
    .map(product => {
      let score = 0.5; // Base score
      const reasons: string[] = [];
      
      // Primary filter: Pet type compatibility (most important)
      if (product.petType) {
        const productPetType = product.petType.toLowerCase();
        
        if (petType === 'dog' || petType === 'puppy') {
          if (productPetType === 'dog' || productPetType === 'both') {
            score += 0.4;
            reasons.push('Suitable for dogs');
          } else if (productPetType === 'cat') {
            score -= 0.8; // Heavy penalty for cat products
            reasons.push('Not suitable for dogs');
          }
        } else if (petType === 'cat' || petType === 'kitten') {
          if (productPetType === 'cat' || productPetType === 'both') {
            score += 0.4;
            reasons.push('Suitable for cats');
          } else if (productPetType === 'dog') {
            score -= 0.8; // Heavy penalty for dog products
            reasons.push('Not suitable for cats');
          }
        }
      }
      
      // Secondary filter: Gender compatibility
      if (petGender && product.petType !== 'both') {
        // Check if product has gender-specific features
        const hasGenderFeatures = product.features?.some(f => 
          f.toLowerCase().includes(petGender) ||
          f.toLowerCase().includes('male') ||
          f.toLowerCase().includes('female')
        );
        
        if (hasGenderFeatures) {
          score += 0.1;
          reasons.push(`Suitable for ${petGender} pets`);
        }
      }
      
      // Age-based recommendations
      if (petAge) {
        const isYoungPet = petAge < 1;
        const productTags = product.tags?.map(t => t.toLowerCase()) || [];
        
        if (isYoungPet && (productTags.includes('puppy') || productTags.includes('kitten'))) {
          score += 0.2;
          reasons.push('Perfect for young pets');
        }
      }
      
      // Category-based scoring
      const category = product.category?.toLowerCase();
      if (petType === 'dog' || petType === 'puppy') {
        if (category === 'foods' || category === 'toys') {
          score += 0.1;
          reasons.push('Popular for dogs');
        }
      } else if (petType === 'cat' || petType === 'kitten') {
        if (category === 'foods' || category === 'supplements') {
          score += 0.1;
          reasons.push('Popular for cats');
        }
      }
      
      // Rating bonus
      if (product.rating && product.rating > 4) {
        score += 0.1;
        reasons.push('Highly rated');
      }
      
      // Stock availability
      if (product.inStock === false) {
        score -= 0.3;
        reasons.push('Out of stock');
      }
      
      // Ensure score stays within bounds
      score = Math.max(0, Math.min(1, score));
      
      return { product, score, reasons };
    })
    .filter(rec => rec.score > 0.2) // Filter out very poor matches
    .sort((a, b) => b.score - a.score); // Sort by best match first
}

/**
 * Get products specifically suitable for the user's pet type
 */
export function getPetTypeSpecificProducts(
  products: Product[], 
  petType: string
): Product[] {
  if (!petType || !products) return products;
  
  const normalizedPetType = petType.toLowerCase();
  const isDog = normalizedPetType === 'dog' || normalizedPetType === 'puppy';
  const isCat = normalizedPetType === 'cat' || normalizedPetType === 'kitten';
  
  return products.filter(product => {
    if (!product.petType) return true; // Include products without pet type restriction
    
    const productPetType = product.petType.toLowerCase();
    
    if (isDog) {
      return productPetType === 'dog' || productPetType === 'both';
    } else if (isCat) {
      return productPetType === 'cat' || productPetType === 'both';
    }
    
    return productPetType === 'both';
  });
}
