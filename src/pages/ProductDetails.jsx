import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data?.data || response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Product not found');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link to="/shop" className="inline-flex items-center text-gray-600 hover:text-brand-accent mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Shop
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-100 rounded-lg">
              {product.image ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiShoppingCart className="text-gray-300" size={80} />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-4xl font-bold text-gray-900 mb-6">
                KES {parseFloat(product.price).toLocaleString()}
              </p>
              <p className="text-gray-600 mb-6">{product.description}</p>

              {product.stock > 0 ? (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-100"
                      >
                        <FiMinus size={20} />
                      </button>
                      <span className="px-6 py-3 font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-3 hover:bg-gray-100"
                      >
                        <FiPlus size={20} />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(product, quantity);
                        setQuantity(1);
                        navigate('/cart');
                      }}
                      className="flex-1 flex items-center justify-center px-6 py-3 bg-brand-accent hover:bg-orange-600 text-white font-semibold rounded-lg"
                    >
                      <FiShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Total: <span className="font-bold">KES {(parseFloat(product.price) * quantity).toLocaleString()}</span>
                  </p>
                </div>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;