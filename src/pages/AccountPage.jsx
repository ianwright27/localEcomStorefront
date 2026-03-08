/**
 * Account Page - Customer Dashboard
 * Order history, profile, addresses, and more
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiShoppingBag, FiMapPin, FiLock, FiLogOut,
  FiPackage, FiClock, FiCheckCircle, FiTruck, FiEdit2, FiX,
} from 'react-icons/fi';
import api from '../services/api';

// ── Simple inline alert (replaces toast entirely) ─────────────────────────────
const Alert = ({ type, message, onClose }) => {
  if (!message) return null;
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error:   'bg-red-50 border-red-200 text-red-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  };
  return (
    <div className={`flex items-center justify-between p-3 mb-4 border rounded-lg text-sm ${styles[type] || styles.info}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 hover:opacity-70"><FiX size={16} /></button>
    </div>
  );
};

// ── Hook for alert state ──────────────────────────────────────────────────────
const useAlert = () => {
  const [alert, setAlert] = useState(null);
  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  }, []);
  const clearAlert = useCallback(() => setAlert(null), []);
  return { alert, showAlert, clearAlert };
};

// ─────────────────────────────────────────────────────────────────────────────

const AccountPage = () => {
  const navigate = useNavigate();
  const { alert, showAlert, clearAlert } = useAlert();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
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
      const response = await api.get('/api/v1/customers/orders');
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (error.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/login');
  };

  const getStatusColor = (status) => ({
    pending:    'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped:    'bg-purple-100 text-purple-800',
    delivered:  'bg-green-100 text-green-800',
    cancelled:  'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800');

  if (!customer) return null;

  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-1">Welcome back, {customer.name}!</p>
        </div>

        {/* Page-level alert */}
        <Alert type={alert?.type} message={alert?.message} onClose={clearAlert} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <nav className="space-y-2">
                {[
                  { key: 'overview',   label: 'Overview',   icon: <FiUser size={18} /> },
                  { key: 'orders',     label: 'Orders',     icon: <FiShoppingBag size={18} /> },
                  { key: 'profile',    label: 'Profile',    icon: <FiEdit2 size={18} /> },
                  { key: 'addresses',  label: 'Addresses',  icon: <FiMapPin size={18} /> },
                  { key: 'password',   label: 'Password',   icon: <FiLock size={18} /> },
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => { setActiveTab(key); clearAlert(); }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === key ? 'bg-brand-accent text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{icon}</span>
                    {label}
                    {key === 'orders' && orders.length > 0 && (
                      <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                        {orders.length}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  <FiLogOut className="mr-3" size={18} /> Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
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
                    <p className="text-3xl font-bold text-gray-900">KES {totalSpent.toLocaleString()}</p>
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

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-brand-accent hover:text-brand-primary text-sm font-medium">
                      View All
                    </button>
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <FiShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                      <Link to="/shop" className="inline-block mt-4 px-6 py-2 bg-brand-accent hover:bg-orange-600 text-white rounded-lg transition-colors">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <Link key={order.id} to={`/order/${order.id}`}
                          className="block border border-gray-200 rounded-lg p-4 hover:border-brand-accent transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Order #{order.order_number || order.id}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            <span className="font-bold text-gray-900">KES {parseFloat(order.total).toLocaleString()}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <OrdersTab orders={orders} loading={loading} getStatusColor={getStatusColor} />
            )}

            {activeTab === 'profile' && (
              <ProfileTab customer={customer} setCustomer={setCustomer} showAlert={showAlert} />
            )}

            {activeTab === 'addresses' && (
              <AddressesTab customer={customer} />
            )}

            {activeTab === 'password' && (
              <PasswordTab showAlert={showAlert} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// ── Orders Tab ────────────────────────────────────────────────────────────────
const OrdersTab = ({ orders, loading, getStatusColor }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
      </div>
    ) : orders.length === 0 ? (
      <div className="text-center py-12">
        <FiShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 mb-4">No orders yet</p>
        <Link to="/shop" className="inline-block px-6 py-2 bg-brand-accent hover:bg-orange-600 text-white rounded-lg transition-colors">
          Start Shopping
        </Link>
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/order/${order.id}`}
            className="block border border-gray-200 rounded-lg p-4 hover:border-brand-accent transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">Order #{order.order_number || order.id}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="text-lg font-bold text-gray-900">KES {parseFloat(order.total).toLocaleString()}</span>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);

// ── Profile Tab ───────────────────────────────────────────────────────────────
const ProfileTab = ({ customer, setCustomer, showAlert }) => {
  const [formData, setFormData] = useState({
    name:  customer.name  || '',
    email: customer.email || '',
    phone: customer.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.put('/api/v1/customers/profile', formData);
      if (response.data?.status === 'success') {
        const updated = { ...customer, ...formData };
        setCustomer(updated);
        localStorage.setItem('customer', JSON.stringify(updated));
        showAlert('success', 'Profile updated successfully!');
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Full Name',     name: 'name',  type: 'text'  },
          { label: 'Email Address', name: 'email', type: 'email' },
          { label: 'Phone Number',  name: 'phone', type: 'tel'   },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input type={type} name={name} value={formData[name]}
              onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        ))}
        <button type="submit" disabled={saving}
          className="w-full px-6 py-3 bg-brand-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

// ── Addresses Tab ─────────────────────────────────────────────────────────────
const AddressesTab = ({ customer }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
    <p className="text-gray-600 mb-4">Manage your delivery addresses</p>
    {customer.address && (
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <span className="inline-block px-2 py-1 bg-brand-accent text-white text-xs font-semibold rounded mb-2">Default</span>
        <p className="text-gray-900 font-medium">{customer.name}</p>
        <p className="text-gray-600 text-sm mt-1">{customer.address}</p>
        <p className="text-gray-600 text-sm">{customer.phone}</p>
      </div>
    )}
    <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-brand-accent hover:text-brand-accent transition-colors">
      + Add New Address
    </button>
  </div>
);

// ── Password Tab ──────────────────────────────────────────────────────────────
const PasswordTab = ({ showAlert }) => {
  const [formData, setFormData] = useState({
    current_password: '', new_password: '', confirm_password: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      showAlert('error', 'Passwords do not match');
      return;
    }
    try {
      setSaving(true);
      const response = await api.put('/api/v1/customers/password', {
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      if (response.data?.status === 'success') {
        showAlert('success', 'Password updated successfully!');
        setFormData({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Current Password', name: 'current_password' },
          { label: 'New Password',     name: 'new_password'     },
          { label: 'Confirm New Password', name: 'confirm_password' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input type="password" name={name} value={formData[name]}
              onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
              required minLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        ))}
        <button type="submit" disabled={saving}
          className="w-full px-6 py-3 bg-brand-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default AccountPage;