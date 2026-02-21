/**
 * Business Configuration
 * Each business gets its own config file
 * 
 * To deploy for a different business:
 * 1. Copy this file to config/businesses/[business-slug].js
 * 2. Update environment variable: REACT_APP_BUSINESS_CONFIG=[business-slug]
 * 3. Build and deploy
 */

const businessConfig = {
  // Business Identity
  business: {
    id: 1, // Business ID from database
    name: 'WrightCommerce Demo Store',
    slug: 'wrightcommerce-demo',
    tagline: 'Quality Products, Swift Delivery',
    description: 'Your trusted online store for premium products across East Africa.',
    
    // Contact
    email: 'hello@wrightcommerce.com',
    phone: '+254 712 345 678',
    address: 'Nairobi, Kenya',
    
    // Logo & Branding
    logo: '/logo.png', // Path to logo in public folder
    favicon: '/favicon.ico',
  },

  // Theme Configuration (matches admin branding)
  theme: {
    colors: {
      primary: '#2563eb',     // Blue - main brand color
      secondary: '#1e40af',   // Darker blue
      accent: '#f97316',      // Orange - CTAs and highlights
      success: '#10b981',     // Green
      warning: '#f59e0b',     // Yellow
      error: '#ef4444',       // Red
      
      // Text
      textPrimary: '#1f2937',   // Gray-800
      textSecondary: '#6b7280', // Gray-500
      textLight: '#9ca3af',     // Gray-400
      
      // Backgrounds
      bgPrimary: '#ffffff',
      bgSecondary: '#f9fafb',   // Gray-50
      bgDark: '#111827',        // Gray-900
    },
    
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    
    borderRadius: {
      small: '0.375rem',   // 6px
      medium: '0.5rem',    // 8px
      large: '0.75rem',    // 12px
      full: '9999px',      // Circular
    },
  },

  // Landing Page Configuration
  landing: {
    enabled: true,
    hero: {
      title: 'Welcome to WrightCommerce',
      subtitle: 'Discover amazing products at great prices',
      ctaText: 'Shop Now',
      ctaLink: '/shop',
      backgroundImage: '/hero-bg.jpg', // Optional
    },
    
    sections: [
      {
        type: 'featured-products',
        title: 'Featured Products',
        limit: 8,
      },
      {
        type: 'categories',
        title: 'Shop by Category',
      },
      {
        type: 'about',
        title: 'About Us',
        content: 'We are committed to bringing you the best products with exceptional service.',
      },
    ],
  },

  // Articles/Content Pages
  articles: {
    enabled: true,
    pages: [
      {
        slug: 'about',
        title: 'About Us',
        content: 'Learn more about our story and mission.',
      },
      {
        slug: 'shipping',
        title: 'Shipping & Delivery',
        content: 'Information about our shipping policies.',
      },
      {
        slug: 'returns',
        title: 'Returns & Refunds',
        content: 'Our return and refund policy.',
      },
    ],
  },

  // Payment Configuration
  payments: {
    methods: ['paystack', 'mpesa', 'cash'],
    currency: 'KES',
    paystackPublicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  },

  // Features
  features: {
    cart: true,
    wishlist: false, // Future feature
    reviews: false,  // Future feature
    search: true,
    filters: true,
    sorting: true,
  },

  // SEO
  seo: {
    title: 'WrightCommerce Demo Store - Shop Online',
    description: 'Shop quality products online with fast delivery across Kenya.',
    keywords: 'online shopping, Kenya, products, e-commerce',
  },

  // Social Media
  social: {
    facebook: '',
    twitter: '',
    instagram: '',
    whatsapp: '+254712345678',
  },
};

export default businessConfig;