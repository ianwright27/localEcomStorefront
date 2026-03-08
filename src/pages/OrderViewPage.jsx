/**
 * OrderViewPage
 * Displays a single customer order with items, status, payment & shipping info
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShoppingBag,
  FiList,
  FiGrid,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiShoppingCart,
} from 'react-icons/fi';
import { customersAPI } from '../services/api';
import { useCart } from '../context/CartContext';

// ── Status helpers ────────────────────────────────────────────────────────────

const ORDER_STEPS = ['pending', 'processing', 'shipped', 'completed'];

const statusColor = (status) => ({
  pending:    'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-purple-100 text-purple-800',
  completed:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}[status] ?? 'bg-gray-100 text-gray-800');

const paymentColor = (status) => ({
  paid:    'bg-green-100 text-green-800',
  unpaid:  'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
}[status] ?? 'bg-gray-100 text-gray-800');

const stepIndex = (status) => ORDER_STEPS.indexOf(status);

// ── Component ─────────────────────────────────────────────────────────────────

const OrderViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [reordered, setReordered] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await customersAPI.getOrder(id);
      setOrder(res.data?.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = () => {
    if (!order?.items?.length) return;
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.product_id,
          name: item.product_name,
          price: item.price,
          image: item.image,
        },
        item.quantity
      );
    });
    setReordered(true);
    setTimeout(() => navigate('/cart'), 800);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary" />
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <FiPackage size={48} className="text-gray-300 mb-4" />
      <p className="text-gray-600 mb-6">{error}</p>
      <button onClick={() => navigate('/account')} className="flex items-center text-brand-accent hover:underline">
        <FiArrowLeft className="mr-1" /> Back to Account
      </button>
    </div>
  );

  if (!order) return null;

  const isCancelled = order.status === 'cancelled';
  const currentStep = stepIndex(order.status);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* ── Top nav ── */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/account')}
            className="flex items-center text-gray-600 hover:text-brand-accent transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Account
          </button>
          <Link
            to="/shop"
            className="flex items-center text-sm text-brand-accent hover:underline"
          >
            <FiShoppingBag className="mr-1" size={15} /> Continue Shopping
          </Link>
        </div>

        {/* ── Header ── */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order {order.order_number}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-KE', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(order.status)}`}>
                {order.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${paymentColor(order.payment_status)}`}>
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>

        {/* ── Status Timeline ── */}
        {!isCancelled && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-5 flex items-center">
              <FiPackage className="mr-2" /> Order Timeline
            </h2>
            <div className="relative">
              {/* Progress bar */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 mx-8">
                <div
                  className="h-full bg-brand-accent transition-all duration-500"
                  style={{ width: `${Math.max(0, (currentStep / (ORDER_STEPS.length - 1)) * 100)}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {ORDER_STEPS.map((step, i) => {
                  const done    = i <= currentStep;
                  const current = i === currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center w-1/4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 text-xs font-bold border-2 transition-colors
                        ${done
                          ? 'bg-brand-accent border-brand-accent text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                        } ${current ? 'ring-4 ring-orange-100' : ''}`}
                      >
                        {i + 1}
                      </div>
                      <span className={`mt-2 text-xs capitalize text-center leading-tight
                        ${done ? 'text-brand-accent font-semibold' : 'text-gray-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
            This order was cancelled.
          </div>
        )}

        {/* ── Info Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Payment */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <FiCreditCard className="mr-2" /> Payment
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Method</dt>
                <dd className="font-medium capitalize">{order.payment_method || 'Paystack'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className={`font-semibold capitalize ${
                  order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>{order.payment_status}</dd>
              </div>
              {order.payment_reference && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Reference</dt>
                  <dd className="font-mono text-xs text-gray-600 truncate max-w-[140px]">
                    {order.payment_reference}
                  </dd>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 mt-2">
                <dt className="font-semibold text-gray-700">Total</dt>
                <dd className="font-bold text-lg text-gray-900">
                  KES {parseFloat(order.total).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <FiMapPin className="mr-2" /> Shipping Address
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.shipping_address || order.customer?.address || '—'}
            </p>
            {order.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 font-medium mb-1">Order Notes</p>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-700">
              Items ({order.items?.length || 0})
            </h2>
            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-brand-accent text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="List view"
              >
                <FiList size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-brand-accent text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Grid view"
              >
                <FiGrid size={16} />
              </button>
            </div>
          </div>

          {/* List view */}
          {viewMode === 'list' && (
            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiShoppingBag className="text-gray-300" size={24} />
                      </div>
                    )}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      KES {parseFloat(item.total ?? item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      KES {parseFloat(item.price).toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {order.items?.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100">
                    {item.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiShoppingBag className="text-gray-300" size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      KES {parseFloat(item.total ?? item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order total row */}
          <div className="flex justify-end border-t pt-4 mt-4">
            <div className="text-right">
              <span className="text-sm text-gray-500">Order Total</span>
              <p className="text-xl font-bold text-gray-900">
                KES {parseFloat(order.total).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={() => navigate('/account')}
            className="flex items-center justify-center px-5 py-3 border-2 border-gray-300 text-gray-700 hover:border-brand-accent hover:text-brand-accent font-medium rounded-lg transition-colors"
          >
            <FiArrowLeft className="mr-2" size={16} /> Back to Account
          </button>
          <Link
            to="/shop"
            className="flex items-center justify-center px-5 py-3 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium rounded-lg transition-colors"
          >
            <FiShoppingBag className="mr-2" size={16} /> Continue Shopping
          </Link>
          <button
            onClick={handleReorder}
            disabled={reordered || !order.items?.length}
            className="flex items-center justify-center px-5 py-3 bg-brand-accent hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            <FiShoppingCart className="mr-2" size={16} />
            {reordered ? 'Added to Cart!' : 'Reorder'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderViewPage;