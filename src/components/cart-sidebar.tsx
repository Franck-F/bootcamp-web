'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Heart,
  Truck,
  Shield,
  CreditCard,
  Sparkles,
  Gift,
  Star,
  Lock,
  Zap,
  Crown
} from 'lucide-react'
import { useCart } from '@/store/cart-context'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  productId: string
  size: string
  quantity: number
  addedAt: string
  product?: {
    id: string
    name: string
    brand: string
    price: number
    images: string[]
    availableStock: number
  }
}

export function CartSidebar() {
  const { 
    state, 
    removeItem, 
    updateQuantity, 
    setCartOpen, 
    getSubtotal, 
    getTax, 
    getShipping, 
    getTotalPrice,
    getTotalItems 
  } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Utiliser directement les items du state au lieu de fetchCartDetails
    setCartItems(state.items)
  }, [state.items])

  useEffect(() => {
    setMounted(true)
    return () => {
      setCartItems([])
    }
  }, [])

  // Cette fonction n'est plus nécessaire car on utilise directement state.items

  const handleQuantityChange = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, size as any)
    } else {
      updateQuantity(productId, size as any, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string, size: string) => {
    removeItem(productId, size as any)
  }

  const calculateTotal = () => {
    return getTotalPrice()
  }
  
  const calculateSubtotal = () => {
    return getSubtotal()
  }
  
  const calculateTax = () => {
    return getTax()
  }
  
  const calculateShipping = () => {
    return getShipping()
  }

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setCartOpen(false)
    router.push('/checkout')
  }

  if (!state.isOpen || !mounted) return null

  // Debug: log pour vérifier si le panier se rend
  console.log('CartSidebar rendering, isOpen:', state.isOpen)

  const cartContent = (
    <div 
      className="fixed inset-0 overflow-hidden" 
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Backdrop avec effet de flou */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300" 
        onClick={() => setCartOpen(false)} 
        style={{ zIndex: 999999 }}
      />
      
      {/* Panier principal */}
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl border-l border-gray-800/50 transform transition-transform duration-300 ease-out"
        style={{ 
          zIndex: 1000000,
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          maxWidth: '32rem',
          backgroundColor: '#111827',
          border: '2px solid red' // Debug temporaire
        }}
      >
        <div className="flex h-full flex-col">
          {/* Header ultra-moderne */}
          <div className="relative p-8 border-b border-gray-800/50 bg-gradient-to-r from-red-600/10 via-transparent to-pink-600/10">
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl shadow-lg">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">{state.items.length}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Mon Panier</h2>
                  <p className="text-sm text-gray-400 font-medium">
                    {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''} • {formatPrice(calculateSubtotal())}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(false)}
                className="h-12 w-12 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 overflow-y-auto">
            {state.isLoading ? (
              <div className="p-8 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-4 animate-pulse">
                    <div className="w-24 h-24 bg-gray-800/50 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-800/50 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-800/50 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : state.error ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-full flex items-center justify-center">
                    <X className="w-16 h-16 text-red-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Erreur</h3>
                <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                  {state.error}
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Réessayer
                </Button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Votre panier est vide</h3>
                <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                  Découvrez nos collections premium et ajoutez vos sneakers préférées pour commencer votre shopping
                </p>
                <Button 
                  onClick={() => setCartOpen(false)}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Découvrir nos produits
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${index}`} className="group bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/50 rounded-2xl p-6 hover:from-gray-800/50 hover:to-gray-900/50 hover:border-gray-600/50 transition-all duration-300 backdrop-blur-sm">
                    <div className="flex space-x-4">
                      {/* Image du produit */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Image
                          src={item.product?.images[0] || '/images/placeholder-sneaker.jpg'}
                          alt={item.product?.name || 'Produit'}
                          fill
                          className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Informations du produit */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate text-lg group-hover:text-red-400 transition-colors duration-200">
                              {item.product?.name || 'Produit'}
                            </h3>
                            <p className="text-sm text-gray-400 font-medium mb-2">
                              {item.product?.brand || 'Marque'}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.productId, item.size)}
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className="bg-gray-700/50 text-gray-300 border-gray-600 px-3 py-1 rounded-lg font-medium">
                            Taille {item.size}
                          </Badge>
                          <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-3 py-1 rounded-lg font-medium">
                            {formatPrice(item.product?.price || 0)}
                          </Badge>
                        </div>
                        
                        {/* Contrôles de quantité */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200"
                              onClick={() => handleQuantityChange(item.productId, item.size, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-lg font-bold text-white w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200"
                              onClick={() => handleQuantityChange(item.productId, item.size, item.quantity + 1)}
                              disabled={item.product && item.quantity >= item.product.availableStock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-white">
                              {formatPrice((item.product?.price || 0) * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer ultra-moderne */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-800/50 p-6 space-y-6 bg-gradient-to-t from-gray-900/50 to-transparent backdrop-blur-sm">
              {/* Avantages premium */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center space-y-2 p-3 bg-green-600/10 rounded-xl border border-green-600/20">
                  <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-xs text-green-400 font-medium text-center">Livraison gratuite</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-3 bg-blue-600/10 rounded-xl border border-blue-600/20">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-xs text-blue-400 font-medium text-center">Retour 30j</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-3 bg-purple-600/10 rounded-xl border border-purple-600/20">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-xs text-purple-400 font-medium text-center">Paiement sécurisé</p>
                </div>
              </div>

              {/* Détail des prix avec style premium */}
              <div className="relative p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Sous-total</span>
                  <span className="text-sm font-medium text-white">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">TVA (20%)</span>
                  <span className="text-sm font-medium text-white">{formatPrice(calculateTax())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Livraison</span>
                  <span className="text-sm font-medium text-white">
                    {calculateShipping() === 0 ? 'Gratuite' : formatPrice(calculateShipping())}
                  </span>
                </div>
                <div className="border-t border-gray-700/50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-white">Total</span>
                    <span className="text-3xl font-black text-red-400">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>
              
              {/* Boutons d'action premium */}
              <div className="space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={handleCheckout}
                >
                  <CreditCard className="w-6 h-6 mr-3" />
                  Finaliser la commande
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-600/50 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-gray-500 py-4 rounded-2xl font-semibold transition-all duration-300"
                  onClick={() => setCartOpen(false)}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Continuer mes achats
                </Button>
              </div>
              
              {/* Message de livraison gratuite avec style premium */}
              {calculateSubtotal() < 100 && (
                <div className="relative bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 rounded-2xl p-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                  <div className="relative flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm text-yellow-200 font-medium">
                      Ajoutez <span className="font-black text-yellow-100">{(100 - calculateSubtotal()).toFixed(2)} €</span> pour la livraison gratuite !
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Utiliser createPortal pour rendre le panier directement dans le body
  return createPortal(cartContent, document.body)
}
