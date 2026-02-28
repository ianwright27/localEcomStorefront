/**
 * About Page
 */

import React from 'react';
import businessConfig from '../config/businessConfig';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            About {businessConfig.business.name}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {businessConfig.business.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide high-quality products with exceptional customer service,
                  making online shopping easy and reliable for everyone.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To become the most trusted online shopping destination, known for
                  quality products, fast delivery, and customer satisfaction.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quality Products</h4>
                  <p className="text-gray-600">
                    We source only the best products from trusted suppliers
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🚚</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
                  <p className="text-gray-600">
                    Quick and reliable delivery to your doorstep
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-xl">💳</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
                  <p className="text-gray-600">
                    Safe and secure payment options for your peace of mind
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
