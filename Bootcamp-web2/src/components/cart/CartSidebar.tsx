import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';

export function CartSidebar() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, totalAmount, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Panier ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-gray-500 mb-6">
                  Découvrez notre collection de sneakers premium
                </p>
                <Button onClick={closeCart}>
                  Continuer mes achats
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product?.image_url}
                        alt={item.product?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.product?.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product?.brand?.name} • Taille {item.variant?.size}
                      </p>
                      <p className="text-sm font-medium text-orange-600 mt-1">
                        {item.product?.base_price && formatPrice(item.product.base_price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-2 py-1 bg-white border border-gray-300 rounded text-sm min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                            disabled={(item.variant?.stock_quantity || 0) <= item.quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-orange-600">{formatPrice(totalAmount)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  fullWidth 
                  size="lg"
                  onClick={() => {
                    // Navigate to checkout
                    window.location.hash = 'checkout';
                  }}
                >
                  Passer commande
                </Button>
                <Button variant="outline" fullWidth onClick={closeCart}>
                  Continuer mes achats
                </Button>
              </div>

              {/* Free Shipping Notice */}
              <div className="text-center text-sm text-gray-500">
                🚚 Livraison gratuite dès 99€ d'achat
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}