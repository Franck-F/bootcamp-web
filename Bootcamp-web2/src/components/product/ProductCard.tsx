import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { formatPrice, getTotalStock, getAvailableSizes } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const totalStock = getTotalStock(product.variants || []);
  const availableSizes = getAvailableSizes(product.variants || []);
  const isInStock = totalStock > 0;

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
      // Find the first available variant
      const firstAvailableVariant = product.variants.find(v => v.stock_quantity > 0);
      if (firstAvailableVariant) {
        addItem(product, firstAvailableVariant);
      }
    }
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-gray-50 relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300">
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
            </button>
          </div>
          
          {/* Quick View Button */}
          <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <Button
              onClick={onQuickView}
              variant="outline"
              fullWidth
              className="bg-white/95 backdrop-blur-sm border-white hover:bg-white"
            >
              Aperçu rapide
            </Button>
          </div>
        </div>

        {/* Stock Status Badge */}
        {!isInStock && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Épuisé
          </div>
        )}
        
        {/* New Badge */}
        {Math.random() < 0.3 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Nouveau
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-orange-500 uppercase tracking-wide">
            {product.brand?.name}
          </span>
          <span className="text-sm text-gray-500">
            {availableSizes.length > 0 && `${availableSizes.length} tailles`}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>

        {/* Category & Color */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm text-gray-500">{product.category?.name}</span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-500">{product.color}</span>
        </div>

        {/* Available Sizes Preview */}
        {availableSizes.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {availableSizes.slice(0, 6).map((size) => (
                <span
                  key={size}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {size}
                </span>
              ))}
              {availableSizes.length > 6 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{availableSizes.length - 6}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.base_price)}
            </span>
            {Math.random() < 0.2 && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.base_price * 1.3)}
              </span>
            )}
          </div>
          
          {totalStock <= 5 && totalStock > 0 && (
            <span className="text-sm text-orange-600 font-medium">
              Plus que {totalStock} !
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock}
          fullWidth
          className="group-hover:scale-105 transition-transform duration-200"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isInStock ? 'Ajouter au panier' : 'Épuisé'}
        </Button>
      </div>
    </div>
  );
}