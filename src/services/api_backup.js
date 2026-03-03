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
  withCredentials: false, // Important for CORS
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get business ID from config
const BUSINESS_ID = process.env.REACT_APP_BUSINESS_ID || 1;

// Products API
export const productsAPI = {
  // Get all products for this business
  getAll: (params = {}) => {
    return api.get('/api/v1/products', {
      params: {
        ...params,
        business_id: BUSINESS_ID,
        status: 'active', // Only show active products
      },
    });
  },

  // Get single product
  getById: (id) => {
    return api.get(`/api/v1/products/${id}`);
  },

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

// Orders API
export const ordersAPI = {
  // Create new order
  create: (orderData) => {
    return api.post('/api/v1/orders', {
      ...orderData,
      business_id: BUSINESS_ID,
    });
  },

  // Get order by ID
  getById: (id) => {
    return api.get(`/api/v1/orders/${id}`);
  },
};

// Payments API
export const paymentsAPI = {
  // Initialize Paystack payment
  initializePaystack: (orderData) => {
    return api.post('/api/v1/payments/paystack/initialize', orderData);
  },

  // Verify Paystack payment
  verifyPaystack: (reference) => {
    return api.get(`/api/v1/payments/paystack/verify/${reference}`);
  },

  // Get Paystack public key
  getPaystackPublicKey: () => {
    return api.get('/api/v1/payments/paystack/public-key');
  },
};

// Customers API
export const customersAPI = {
  // Login
  login: (credentials) => {
    return api.post('/api/v1/customers/login', credentials);
  },

  // Register
  register: (data) => {
    return api.post('/api/v1/customers/register', data);
  },

  // Get current customer
  getCurrent: () => {
    return api.get('/api/v1/customers/me');
  },

  // Get customer orders
  getOrders: () => {
    return api.get('/api/v1/customers/orders');
  },

  // Get single order
  getOrder: (orderId) => {
    return api.get(`/api/v1/customers/orders/${orderId}`);
  },

  // Update profile
  updateProfile: (data) => {
    return api.put('/api/v1/customers/profile', data);
  },

  // Change password
  changePassword: (data) => {
    return api.put('/api/v1/customers/password', data);
  },

  // Logout
  logout: () => {
    return api.post('/api/v1/customers/logout');
  },
};

export default api;