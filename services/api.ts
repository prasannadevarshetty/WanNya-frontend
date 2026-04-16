const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
import { useProfileStore } from '@/store/useProfileStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';

// Helper to inject global pet filters
const getGlobalPetFilters = () => {
  if (typeof window === 'undefined') return {};
  try {
    const state = useProfileStore.getState();
    const activePet = state.pets?.find(p => p.id === state.selectedPetId);
    
    if (!activePet) return {};
    
    const filters: any = {};
    
    // Add gender filter if available
    if (activePet.gender) {
      filters.gender = activePet.gender;
    }
    
    // Add pet type filter - this is the main algorithm
    if (activePet.type) {
      // Map pet types to backend petType values
      const petTypeMap: { [key: string]: string } = {
        'dog': 'Dog',
        'cat': 'Cat', 
        'puppy': 'Dog',
        'kitten': 'Cat'
      };
      
      const normalizedPetType = activePet.type.toLowerCase();
      if (petTypeMap[normalizedPetType]) {
        filters.petType = petTypeMap[normalizedPetType];
      }
    }
    
    return filters;
  } catch(e) {
    return {};
  }
};

// Helper to get auth token
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('wanya_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper to validate token format
const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  // Basic JWT format check (header.payload.signature)
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

// Generic API request wrapper
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
   if (!API_BASE_URL) {
    throw new Error("❌ API URL missing. Check NEXT_PUBLIC_API_URL in Vercel");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`, config);

  let response;
  try {
    response = await fetch(url, config);
  } catch (error: any) {
    // Network errors (e.g., server not running, CORS, DNS) surface as TypeError: Failed to fetch
    if (error instanceof TypeError) {
      const msg = `Network error when requesting ${url}: ${error.message}`;
      console.error(msg, error);
      throw new Error(msg);
    }
    console.error(`API Network Error (${endpoint}):`, error);
    throw error;
  }

  console.log(`API Response: ${response.status} ${response.statusText} for ${endpoint}`);
  
  if (!response.ok) {
    // Try to parse JSON error body, otherwise fall back to text
    let errorBody: any = {};
    try {
      errorBody = await response.json();
    } catch (e) {
      try {
        const text = await response.text();
        errorBody = text || {};
      } catch (e2) {
        errorBody = {};
      }
    }

    const message = (errorBody && errorBody.message) || `HTTP ${response.status}: ${response.statusText}`;
    
    // Only log as error if it's a server error, for Bad Requests/Unauthorized just warn (or info)
    if (response.status >= 500) {
      console.error(`API Error Response (${response.status} ${response.statusText}):`, errorBody);
    } else {
      console.warn(`API Warning Response (${response.status} ${response.statusText}):`, message);
    }

    if (response.status === 401) {
      // If unauthorized, clear client session but don't force redirect
      // Let the components handle auth state changes gracefully
      try {
        if (typeof window !== 'undefined') {
          console.warn('Authentication failed - clearing auth state');
          // Clear stored auth and other client state
          useAuthStore.getState().clearAuth?.();
          useProfileStore.getState().clearProfile?.();
          useNotificationStore.getState().clearNotifications?.();
          
          // Only show notification for non-login related requests
          if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
            // Notify user
            useNotificationStore.getState().addNotification?.({
              title: 'Session Expired',
              message: 'Please log in again to continue.',
              type: 'warning',
              read: false,
            });
          }
        }
      } catch (e) {
        // ignore errors while cleaning up
      }
      throw new Error(message || 'Unauthorized');
    }
    throw new Error(message);
  }

  // Handle empty/no-content responses gracefully
  if (response.status === 204) {
    console.log(`API Success Response for ${endpoint}: No Content (204)`);
    return null;
  }

  try {
    const data = await response.json();
    console.log(`API Success Response for ${endpoint}:`, data);
    return data;
  } catch (e) {
    // If response body isn't JSON, return raw text
    try {
      const text = await response.text();
      console.log(`API Success Response (non-JSON) for ${endpoint}:`, text);
      return text;
    } catch (e2) {
      return null;
    }
  }
};

// Profile API
export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    return apiRequest('/api/users/profile');
  },

  // Update user profile
  updateProfile: async (userData: any) => {
    return apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Get user's pets
  getPets: async () => {
    return apiRequest('/api/pets');
  },

  // Add new pet
  addPet: async (petData: any) => {
    return apiRequest('/api/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  },

  // Update pet
  updatePet: async (petId: string, petData: any) => {
    console.log('🔄 profileAPI.updatePet called:', { petId, petData });
    try {
      const response = await apiRequest(`/api/pets/${petId}`, {
        method: 'PUT',
        body: JSON.stringify(petData),
      });
      console.log('✅ profileAPI.updatePet success:', response);
      return response;
    } catch (error) {
      console.error('❌ profileAPI.updatePet failed:', error);
      throw error;
    }
  },

  // Delete pet
  deletePet: async (petId: string) => {
    return apiRequest(`/api/pets/${petId}`, {
      method: 'DELETE',
    });
  },

  // Get addresses
  getAddresses: async () => {
    return apiRequest('/api/users/addresses');
  },

  // Add address
  addAddress: async (addressData: any) => {
    return apiRequest('/api/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  // Update address
  updateAddress: async (addressId: string, addressData: any) => {
    return apiRequest(`/api/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  // Delete address
  deleteAddress: async (addressId: string) => {
    return apiRequest(`/api/users/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  // Get orders
  getOrders: async () => {
    return apiRequest('/api/orders/user');
  },

  // Get payments
  getPayments: async () => {
    return apiRequest('/api/users/payments');
  },

  // Add payment method
  addPayment: async (paymentData: any) => {
    return apiRequest('/api/users/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Update payment method
  updatePayment: async (paymentId: string, paymentData: any) => {
    return apiRequest(`/api/users/payments/${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  },

  // Delete payment method
  deletePayment: async (paymentId: string) => {
    return apiRequest(`/api/users/payments/${paymentId}`, {
      method: 'DELETE',
    });
  },
};

// Cart API
export const cartAPI = {
  // Get cart items
  getCart: async () => {
    return apiRequest('/api/cart');
  },

  // Add item to cart
  addItem: async (itemData: any) => {
    return apiRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Update item quantity
  updateQuantity: async (itemId: string, quantity: number) => {
    return apiRequest(`/api/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove item from cart
  removeItem: async (itemId: string) => {
    return apiRequest(`/api/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Clear cart
  clearCart: async () => {
    return apiRequest('/api/cart', {
      method: 'DELETE',
    });
  },
};

// Wishlist API
export const wishlistAPI = {
  // Get wishlist items
  getWishlist: async () => {
    return apiRequest('/api/wishlist');
  },

  // Add item to wishlist
  addItem: async (itemData: any) => {
    return apiRequest('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Remove item from wishlist
  removeItem: async (itemId: string) => {
    return apiRequest(`/api/wishlist/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Clear wishlist
  clearWishlist: async () => {
    return apiRequest('/api/wishlist', {
      method: 'DELETE',
    });
  },
};

// Products API
export const productsAPI = {
  // Get all products
  getProducts: async (filters?: any) => {
    const safeFilters = { ...getGlobalPetFilters(), ...(filters || {}) };
    const params = new URLSearchParams(safeFilters as Record<string, string>);
    return apiRequest(`/api/products?${params}`);
  },

  // Get product by ID
  getProduct: async (productId: string) => {
    return apiRequest(`/api/products/${productId}`);
  },

  // Search products
  searchProducts: async (query: string, filters?: any) => {
    const safeFilters = { q: query, ...getGlobalPetFilters(), ...(filters || {}) };
    const params = new URLSearchParams(safeFilters as Record<string, string>);
    return apiRequest(`/api/products/search?${params}`);
  },
};

// Auth API
export const authAPI = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register
  register: async (userData: { name: string; email: string; password: string }) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/api/auth/me');
  },

  // Social Login
  socialLogin: async (data: { provider: string; id: string; email: string; name?: string; avatar?: string }) => {
    return apiRequest('/api/auth/social', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Forgot Password - Send OTP
  forgotPassword: async (data: { email: string }) => {
    return apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reset Password with OTP
  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    return apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Logout
  logout: async () => {
    // Backend does not implement token invalidation; logout is handled client-side.
    return { message: 'Logged out' };
  },
};

// Orders API
export const ordersAPI = {
  // Create order from cart
  createOrder: async (data: { 
    items: Array<{
      id: string;
      name: string;
      title: string;
      price: number;
      quantity: number;
      image: string;
      category?: string;
    }>;
    totalAmount: number;
    shippingAddress?: any;
  }) => {
    return apiRequest('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get user orders
  getUserOrders: async () => {
    return apiRequest('/api/orders/user');
  },

  // Cancel order
  cancelOrder: async (orderId: string, cancellationReason: string) => {
    return apiRequest(`/api/orders/cancel/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ cancellationReason }),
    });
  },

  // Get cancelled products
  getCancelledProducts: async () => {
    return apiRequest('/api/orders/cancelled');
  },
};
