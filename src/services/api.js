/**
 * API Service for Storefront
 * Handles all API calls to the WrightCommerce backend
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost/wrightcommerce/public',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS
});

// ── Request interceptor: attach Bearer token to every request ──────────────
api.interceptors.request.use(
  (config) => {
    try {
      const customer = JSON.parse(localStorage.getItem('customer'));
      if (customer?.token) {
        config.headers.Authorization = `Bearer ${customer.token}`;
      }
    } catch (e) {
      // Ignore malformed localStorage data
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: error logging + auto-logout on 401 ───────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    const url = error.config?.url || '';
    if (error.response?.status === 401 && url.includes('/customers/')) {
      // Token expired or invalid on a protected route — clear session and redirect
      localStorage.removeItem('customer');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Get business ID from config
const BUSINESS_ID = process.env.REACT_APP_BUSINESS_ID || 1;

// ── Products API ────────────────────────────────────────────────────────────
export const productsAPI = {
  // Get all products for this business
  getAll: (params = {}) => {
    return api.get('/api/v1/products', {
      params: {
        ...params,
        business_id: BUSINESS_ID,
        status: 'active',
      },
    });
  },

  // Get single product
  getById: (id) => api.get(`/api/v1/products/${id}`),

  // Search products
  search: (query) => {
    return api.get('/api/v1/products/search', {
      params: { q: query, business_id: BUSINESS_ID },
    });
  },

  // Get categories
  getCategories: () => {
    return api.get('/api/v1/products/categories', {
      params: { business_id: BUSINESS_ID },
    });
  },
};

// ── Orders API ──────────────────────────────────────────────────────────────
export const ordersAPI = {
  // Create new order
  create: (orderData) => {
    return api.post('/api/v1/orders', {
      ...orderData,
      business_id: BUSINESS_ID,
    });
  },

  // Get order by ID
  getById: (id) => api.get(`/api/v1/orders/${id}`),
};

// ── Payments API ────────────────────────────────────────────────────────────
export const paymentsAPI = {
  // Initialize Paystack payment
  initializePaystack: (orderData) => api.post('/api/v1/payments/paystack/initialize', orderData),

  // Verify Paystack payment
  verifyPaystack: (reference) => api.get(`/api/v1/payments/paystack/verify/${reference}`),

  // Get Paystack public key
  getPaystackPublicKey: () => api.get('/api/v1/payments/paystack/public-key'),
};

// ── Customers API ───────────────────────────────────────────────────────────
export const customersAPI = {
  // Register
  register: (data) => api.post('/api/v1/customers/register', data),

  // Login
  login: (credentials) => api.post('/api/v1/customers/login', credentials),

  // Get current customer profile
  getProfile: () => api.get('/api/v1/customers/profile'),

  // Update profile
  updateProfile: (data) => api.put('/api/v1/customers/profile', data),

  // Change password
  changePassword: (data) => api.put('/api/v1/customers/password', data),

  // Get all customer orders
  getOrders: () => api.get('/api/v1/customers/orders'),

  // Get single order
  getOrder: (orderId) => api.get(`/api/v1/customers/orders/${orderId}`),

  // Logout
  logout: () => api.post('/api/v1/customers/logout'),
};

export default api;