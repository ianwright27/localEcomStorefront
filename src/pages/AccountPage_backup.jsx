/**
 * Account Page - Customer Dashboard
 * Order history, profile, addresses, and more
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiLock,
  FiLogOut,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiEdit2,
  FiX,
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import api from '../services/api';

const AccountPage = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, profile, addresses, password

  useEffect(() => {
    // Check if customer is logged in
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      navigate('/login');
      return;
    }

    setCustomer(JSON.parse(customerData));
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/customers/orders', {
        withCredentials: true,
      });
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (error.response?.status === 401) {
        // Session expired
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FiClock />,
      processing: <FiPackage />,
      shipped: <FiTruck />,
      delivered: <FiCheckCircle />,
      cancelled: <FiX />,
    };
    return icons[status] || <FiClock />;
  };

  if (!customer) {
    return null;
  }

  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-1">Welcome back, {customer.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-brand-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiUser className="mr-3" size={18} />
                  Overview
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-brand-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiShoppingBag className="mr-3" size={18} />
                  Orders
                  {orders.length > 0 && (
                    <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-brand-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiEdit2 className="mr-3" size={18} />
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-brand-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiMapPin className="mr-3" size={18} />
                  Addresses
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'password'
                      ? 'bg-brand-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiLock className="mr-3" size={18} />
                  Password
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  <FiLogOut className="mr-3" size={18} />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Total Orders</span>
                      <FiShoppingBag className="text-brand-accent" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Total Spent</span>
                      <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      KES {totalSpent.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Active Orders</span>
                      <FiTruck className="text-brand-accent" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                    </p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-brand-accent hover:text-brand-primary text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <FiShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                      <Link
                        to="/shop"
                        className="inline-block mt-4 px-6 py-2 bg-brand-accent hover:bg-orange-600 text-white rounded-lg transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <Link
                          key={order.id}
                          to={`/order/${order.id}`}
                          className="block border border-gray-200 rounded-lg p-4 hover:border-brand-accent transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              Order #{order.order_number || order.id}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            <span className="font-bold text-gray-900">
                              KES {parseFloat(order.total).toLocaleString()}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} loading={loading} getStatusColor={getStatusColor} />
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <ProfileTab customer={customer} setCustomer={setCustomer} />
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <AddressesTab customer={customer} />
            )}

            {/* PASSWORD TAB */}
            {activeTab === 'password' && (
              <PasswordTab />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Orders Tab Component
const OrdersTab = ({ orders, loading, getStatusColor }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>

    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    ) : orders.length === 0 ? (
      <div className="text-center py-12">
        <FiShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 mb-4">No orders yet</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2 bg-brand-accent hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-brand-accent transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Order #{order.order_number || order.id}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  KES {parseFloat(order.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Profile Tab Component
const ProfileTab = ({ customer, setCustomer }) => {
  const [formData, setFormData] = useState({
    name: customer.name || '',
    email: customer.email || '',
    phone: customer.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.put('/api/v1/customers/profile', formData, {
        withCredentials: true,
      });
      
      if (response.data?.success) {
        const updatedCustomer = { ...customer, ...formData };
        setCustomer(updatedCustomer);
        localStorage.setItem('customer', JSON.stringify(updatedCustomer));
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 bg-brand-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

// Addresses Tab Component (Placeholder)
const AddressesTab = ({ customer }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
    <p className="text-gray-600 mb-4">Manage your delivery addresses</p>
    
    {/* Default address from customer profile */}
    {customer.address && (
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 bg-brand-accent text-white text-xs font-semibold rounded mb-2">
              Default
            </span>
            <p className="text-gray-900 font-medium">{customer.name}</p>
            <p className="text-gray-600 text-sm mt-1">{customer.address}</p>
            <p className="text-gray-600 text-sm">{customer.phone}</p>
          </div>
        </div>
      </div>
    )}
    
    <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-brand-accent hover:text-brand-accent transition-colors">
      + Add New Address
    </button>
  </div>
);

// Password Tab Component
const PasswordTab = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const response = await api.put('/api/v1/customers/password', {
        current_password: formData.current_password,
        new_password: formData.new_password,
      }, {
        withCredentials: true,
      });
      
      if (response.data?.success) {
        toast.success('Password updated successfully!');
        setFormData({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (error) {
      console.error('Password update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 bg-brand-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default AccountPage;
