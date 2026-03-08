/**
 * Payment Success Page
 * Displayed after successful order placement
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { paymentsAPI } from '../services/api';
import { toast } from 'react-toastify';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const order = location.state?.order;
  const reference = searchParams.get('reference');

  useEffect(() => {
    // If coming from Paystack callback, verify payment
    if (reference && !paymentVerified) {
      verifyPayment(reference);
    }
  }, [reference]);

  const verifyPayment = async (ref) => {
    try {
      setVerifying(true);
      const response = await paymentsAPI.verifyPaystack(ref);
      
      if (response.data?.success) {
        setPaymentVerified(true);
        // toast.success('Payment verified successfully!');
        console.log('Payment verified:', response.data);
      } else {
        // toast.error('Payment verification failed');
        console.error('Payment verification failed:', response.data);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      // toast.error('Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-600" size={48} />
            {/* <span className="text-green-600 text-5xl">✓</span> */}
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've received your order and will process it shortly.
          </p>

          {/* Order Details */}
          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.order_number || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">
                    KES {parseFloat(order.total).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-medium ${
                    paymentVerified ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {paymentVerified ? 'Paid' : order.payment_status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-brand-accent mr-2">✓</span>
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-accent mr-2">✓</span>
                <span>We'll prepare your order for delivery</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-accent mr-2">✓</span>
                <span>You'll get updates on your order status</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center justify-center px-6 py-3 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center px-6 py-3 bg-brand-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Home
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
