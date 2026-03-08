/**
 * Cart Page - FIXED VERSION
 * Proper null checks and safe state updates
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowRight,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/CustomerAuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Safe quantity update handler
  const handleQuantityChange = (productId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity) || 0;
    
    if (parsedQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, parsedQuantity);
    }
  };

  // Safe increment handler
  const handleIncrement = (item) => {
    if (item.quantity < (item.stock || 999)) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  // Safe decrement handler
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  // Empty cart state
  if (!cart || cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-md mx-auto">
            <FiShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to get started!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-brand-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Continue Shopping
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Total
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.map((item) => {
                      if (!item || !item.id) return null; // Safety check
                      
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                                    alt={item.name || 'Product'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FiShoppingCart className="text-gray-300" size={24} />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <Link
                                  to={`/product/${item.id}`}
                                  className="font-medium text-gray-900 hover:text-brand-accent"
                                >
                                  {item.name || 'Product'}
                                </Link>
                                {item.category && (
                                  <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900 font-medium">
                              KES {parseFloat(item.price || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleDecrement(item)}
                                className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                                type="button"
                              >
                                <FiMinus size={16} />
                              </button>
                              <input
                                type="number"
                                value={item.quantity || 1}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                className="w-16 mx-2 text-center border border-gray-300 rounded-lg py-1"
                                min="1"
                                max={item.stock || 999}
                              />
                              <button
                                onClick={() => handleIncrement(item)}
                                className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                                disabled={item.quantity >= (item.stock || 999)}
                                type="button"
                              >
                                <FiPlus size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <span className="text-gray-900 font-bold">
                              KES {(parseFloat(item.price || 0) * (item.quantity || 1)).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remove"
                              type="button"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {cart.map((item) => {
                  if (!item || !item.id) return null;
                  
                  return (
                    <div key={item.id} className="p-4">
                      <div className="flex gap-4 mb-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {item.image ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                              alt={item.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiShoppingCart className="text-gray-300" size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/product/${item.id}`}
                            className="font-medium text-gray-900 hover:text-brand-accent"
                          >
                            {item.name || 'Product'}
                          </Link>
                          {item.category && (
                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                          )}
                          <p className="text-sm font-medium text-gray-900 mt-2">
                            KES {parseFloat(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            type="button"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="px-4 font-medium">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity >= (item.stock || 999)}
                            type="button"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">
                            KES {(parseFloat(item.price || 0) * (item.quantity || 1)).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            type="button"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              type="button"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center px-6 py-3 bg-brand-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                type="button"
              >
                Proceed to Checkout
                <FiArrowRight className="ml-2" />
              </button>

              <Link
                to="/shop"
                className="block text-center mt-4 text-brand-accent hover:text-brand-primary font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
