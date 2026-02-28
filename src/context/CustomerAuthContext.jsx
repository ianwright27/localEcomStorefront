/**
 * Customer Auth Context - NO TOAST
 * Handles customer login, registration, and session management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedCustomer = localStorage.getItem('customer');
    const savedToken = localStorage.getItem('customerToken');
    
    if (savedCustomer && savedToken) {
      setCustomer(JSON.parse(savedCustomer));
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/v1/customers/login', {
        email,
        password,
      });

      if (response.data?.success) {
        const { customer: customerData, token } = response.data.data;
        
        setCustomer(customerData);
        localStorage.setItem('customer', JSON.stringify(customerData));
        localStorage.setItem('customerToken', token);
        
        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Register
  const register = async (name, email, phone, password) => {
    try {
      const response = await api.post('/api/v1/customers/register', {
        name,
        email,
        phone,
        password,
      });

      if (response.data?.success) {
        const { customer: customerData, token } = response.data.data;
        
        setCustomer(customerData);
        localStorage.setItem('customer', JSON.stringify(customerData));
        localStorage.setItem('customerToken', token);
        
        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Logout
  const logout = () => {
    setCustomer(null);
    localStorage.removeItem('customer');
    localStorage.removeItem('customerToken');
    delete api.defaults.headers.common['Authorization'];
  };

  // Update customer profile
  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/api/v1/customers/profile', updates);

      if (response.data?.success) {
        const updatedCustomer = response.data.data;
        setCustomer(updatedCustomer);
        localStorage.setItem('customer', JSON.stringify(updatedCustomer));
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed',
      };
    }
  };

  const value = {
    customer,
    loading,
    isAuthenticated: !!customer,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
