// Core types for the StrideStyle e-commerce platform

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'seller' | 'client';
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  target_audience: 'kids' | 'men' | 'women';
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand_id: string;
  category_id: string;
  base_price: number;
  image_url: string;
  image_urls: string[];
  color: string;
  material: string;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  stock_quantity: number;
  sku: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  targetAudience: 'all' | 'kids' | 'men' | 'women';
}

export interface SizeChart {
  kids: string[];
  men: string[];
  women: string[];
}