'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
  Star
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
  const { state, removeItem, updateQuantity, setCartOpen } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (state.items.length > 0) {
      fetchCartDetails()
    } else {
      setCartItems([])
    }
  }, [state.items])

  // Nettoyer les états lors du démontage du composant
  useEffect(() => {
    return () => {
      setCartItems([])
      setLoading(false)
    }
  }, [])

  const fetchCartDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
    } finally {
      setLoading(false)
    }
  }

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
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }

  const handleCheckout = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    setCartOpen(false)
    router.push('/checkout')
  }

  if (!state.isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black shadow-2xl border-l border-gray-800 z-[10000]">
        <div className="flex h-full flex-col">
          {/* Header moderne */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gradient-to-r from-red-600/20 to-pink-600/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mon Panier</h2>
                <p className="text-sm text-gray-400">{state.items.length} article{state.items.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-4 animate-pulse">
                    <div className="w-20 h-20 bg-gray-800 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Votre panier est vide</h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                  Découvrez nos collections premium et ajoutez vos sneakers préférées
                </p>
                <Button 
                  onClick={() => setCartOpen(false)}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Découvrir nos produits
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${index}`} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-200">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 relative flex-shrink-0 bg-white rounded-xl overflow-hidden">
                        <Image
                          src={item.product?.images[0] || '/images/placeholder-sneaker.jpg'}
                          alt={item.product?.name || 'Produit'}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate text-sm">
                          {item.product?.name || 'Produit'}
                        </h3>
                        <p className="text-xs text-gray-400 mb-1">
                          {item.product?.brand || 'Marque'}
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {item.size}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            Qty: {item.quantity}
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-red-400">
                          {formatPrice(item.product?.price || 0)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.productId, item.size)}
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => handleQuantityChange(item.productId, item.size, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-bold text-white w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => handleQuantityChange(item.productId, item.size, item.quantity + 1)}
                            disabled={item.product && item.quantity >= item.product.availableStock}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer moderne */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-800 p-6 space-y-6 bg-gradient-to-t from-gray-900 to-transparent">
              {/* Avantages */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400">Livraison gratuite</p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-gray-400">Retour 30j</p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xs text-gray-400">Paiement sécurisé</p>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <div>
                  <span className="text-lg font-bold text-white">Total</span>
                  <p className="text-xs text-gray-400">TVA incluse</p>
                </div>
                <span className="text-2xl font-bold text-red-400">{formatPrice(calculateTotal())}</span>
              </div>
              
              {/* Boutons d'action */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                  onClick={handleCheckout}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Finaliser la commande
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white py-3 rounded-xl"
                  onClick={() => setCartOpen(false)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Continuer mes achats
                </Button>
              </div>
              
              {/* Message de livraison gratuite */}
              {calculateTotal() < 100 && (
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    <p className="text-sm text-yellow-200">
                      Ajoutez <span className="font-bold">{(100 - calculateTotal()).toFixed(2)} €</span> pour la livraison gratuite !
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
}
