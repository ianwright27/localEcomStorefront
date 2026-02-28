/**
 * Storefront Layout
 * Main layout wrapper for customer-facing pages
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiPhone,
  FiMail,
  FiLogOut,
} from 'react-icons/fi';
import businessConfig from '../../config/businessConfig';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/CustomerAuthContext';

const StorefrontLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { customer, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-brand-primary text-white text-xs py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FiPhone size={12} className="mr-1" />
              {businessConfig.business.phone}
            </span>
            <span className="hidden sm:flex items-center">
              <FiMail size={12} className="mr-1" />
              {businessConfig.business.email}
            </span>
          </div>
          <div className="text-xs">
            {businessConfig.business.tagline}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {businessConfig.business.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {businessConfig.business.name}
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-brand-accent transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Icon (Mobile) */}
              <button className="md:hidden text-gray-700 hover:text-brand-accent">
                <FiSearch size={20} />
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/account"
                    className="flex items-center text-gray-700 hover:text-brand-accent transition-colors"
                  >
                    <FiUser size={20} className="mr-1" />
                    <span className="text-sm">{customer?.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <FiLogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center text-gray-700 hover:text-brand-accent transition-colors"
                >
                  <FiUser size={20} className="mr-1" />
                  <span className="text-sm">Login</span>
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-brand-accent transition-colors"
              >
                <FiShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-brand-accent py-2 font-medium"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Links */}
              <div className="pt-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-brand-accent py-2 font-medium"
                    >
                      <FiUser className="mr-2" size={18} />
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-red-600 hover:text-red-800 py-2 font-medium w-full text-left"
                    >
                      <FiLogOut className="mr-2" size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-brand-accent py-2 font-medium"
                    >
                      <FiUser className="mr-2" size={18} />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-brand-accent hover:text-brand-primary py-2 font-medium"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-white font-bold mb-4">
                {businessConfig.business.name}
              </h3>
              <p className="text-sm">
                {businessConfig.business.description}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/shop" className="hover:text-white">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-white font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/shipping" className="hover:text-white">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="hover:text-white">
                    Returns & Refunds
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <FiPhone className="mr-2" size={14} />
                  {businessConfig.business.phone}
                </li>
                <li className="flex items-center">
                  <FiMail className="mr-2" size={14} />
                  {businessConfig.business.email}
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>
              © {new Date().getFullYear()} {businessConfig.business.name}. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Powered by WrightCommerce
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
