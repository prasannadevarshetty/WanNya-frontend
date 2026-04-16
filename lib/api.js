// API service layer for WanNya frontend
// Ensure base URL always points to the backend root and includes /api
const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_BASE_URL = rawBase.replace(/\/$/, '') + '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('wanya_token', token);
    }
  }

  // Get authentication token
  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wanya_token');
    }
    return null;
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wanya_token');
    }
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body,
      // keep other fetch options if provided (mode, credentials, etc.)
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      // Network-level errors (DNS, refused connection) will throw here
      const response = await fetch(url, config);

      // Try to parse JSON if any
      let data = null;
      try {
        data = await response.json();
      } catch (parseErr) {
        // ignore parse errors, keep data as null
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error, 'for', url);
      // Provide a clearer error for UI
      throw new Error(error.message || 'Network error while contacting API');
    }
  }

  // HTTP methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Authentication endpoints
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async socialLogin(provider, authData) {
    const response = await this.post('/auth/social', { provider, ...authData });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  async updateProfile(userData) {
    return this.put('/auth/me', userData);
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email });
  }

  async sendOtp(email) {
    return this.post('/auth/send-otp', { email });
  }

  async verifyOtp(email, otp) {
    return this.post('/auth/verify-otp', { email, otp });
  }

  async resetPassword(token, newPassword) {
    return this.post('/auth/reset-password', { token, newPassword });
  }

  // Pet endpoints
  async getPets() {
    return this.get('/pets');
  }

  async getPet(id) {
    return this.get(`/pets/${id}`);
  }

  async createPet(petData) {
    return this.post('/pets', petData);
  }

  async updatePet(id, petData) {
    return this.put(`/pets/${id}`, petData);
  }

  async deletePet(id) {
    return this.delete(`/pets/${id}`);
  }

  // Product endpoints
  async getProducts(params = {}) {
    return this.get('/products', params);
  }

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async getFeaturedProducts() {
    return this.get('/products/featured');
  }

  async getProductsByCategory(category) {
    return this.get('/products', { category });
  }

  async searchProducts(query) {
    return this.get('/products/search', { q: query });
  }

  async getRecommendations(petType) {
    return this.get(`/products/recommendations/${petType}`);
  }

  // Order endpoints
  async getOrders() {
    return this.get('/orders');
  }

  async getOrder(id) {
    return this.get(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  // Service endpoints
  async getServices(params = {}) {
    return this.get('/services', params);
  }

  async getService(id) {
    return this.get(`/services/${id}`);
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
