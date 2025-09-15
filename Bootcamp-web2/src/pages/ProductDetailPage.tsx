import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { formatPrice, getAvailableSizes } from '../lib/utils';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const availableVariants = product.variants?.filter(v => v.stock_quantity > 0) || [];
  const selectedVariant = availableVariants.find(v => v.size === selectedSize);
  const availableSizes = getAvailableSizes(product.variants || []);

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product, selectedVariant, quantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-orange-500">Accueil</a>
        <span>/</span>
        <a href={`/${product.category?.target_audience}`} className="hover:text-orange-500 capitalize">
          {product.category?.target_audience}
        </a>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.image_urls?.[selectedImageIndex] || product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.image_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <p className="text-orange-500 font-medium text-sm uppercase tracking-wide">
              {product.brand?.name}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5" fill="currentColor" />
                ))}
              </div>
              <span className="text-gray-600">(4.8) • 124 avis</span>
            </div>

            <p className="text-4xl font-bold text-gray-900">
              {formatPrice(product.base_price)}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
            <div>
              <span className="font-medium text-gray-900">Couleur:</span>
              <span className="ml-2 text-gray-600">{product.color}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Matière:</span>
              <span className="ml-2 text-gray-600">{product.material}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Catégorie:</span>
              <span className="ml-2 text-gray-600">{product.category?.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Public:</span>
              <span className="ml-2 text-gray-600 capitalize">{product.category?.target_audience}</span>
            </div>
          </div>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">Choisir une taille</h4>
                <button className="text-orange-500 text-sm hover:underline">
                  Guide des tailles
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`p-3 text-center border-2 rounded-lg transition-all ${
                      selectedSize === variant.size
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{variant.size}</div>
                    <div className="text-xs text-gray-500">
                      {variant.stock_quantity} dispo.
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Quantité</h4>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={(selectedVariant?.stock_quantity || 0) <= quantity}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant}
              fullWidth
              size="lg"
            >
              Ajouter au panier - {formatPrice(product.base_price * quantity)}
            </Button>
            
            <div className="flex space-x-4">
              <Button variant="outline" fullWidth>
                <Heart className="h-5 w-5 mr-2" />
                Favoris
              </Button>
              <Button variant="outline" fullWidth>
                <Share2 className="h-5 w-5 mr-2" />
                Partager
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">Livraison gratuite dès 99€</span>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">Retours gratuits sous 30 jours</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-purple-500" />
              <span className="text-gray-700">Garantie authenticité</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}