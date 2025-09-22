'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Package, Truck, Shield, CreditCard } from 'lucide-react'
import Image from 'next/image'

interface CartItem {
  productId: string
  size: string
  quantity: number
  product?: {
    id: string
    name: string
    brand: string
    price: number
    images: string[]
  }
}

interface OrderSummaryProps {
  cartItems: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export function OrderSummary({ cartItems, subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Résumé de la commande */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span>Résumé de la commande</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.productId}-${item.size}-${index}`} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div className="w-16 h-16 relative flex-shrink-0 bg-white rounded-xl overflow-hidden">
                  <Image
                    src={item.product?.images[0] || '/images/placeholder-sneaker.jpg'}
                    alt={item.product?.name || 'Produit'}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">
                    {item.product?.name || 'Produit'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.product?.brand || 'Marque'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Taille: {item.size}
                  </p>
                  <p className="text-sm text-gray-400">
                    Quantité: {item.quantity}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-white">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Détails des coûts */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Détails des coûts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Sous-total</span>
              <span className="font-bold text-white">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Livraison</span>
              <span className="font-bold text-white">
                {shipping === 0 ? (
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Gratuite</Badge>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">TVA (20%)</span>
              <span className="font-bold text-white">{formatPrice(tax)}</span>
            </div>
            
            <div className="border-t border-gray-700/50 pt-4">
              <div className="flex justify-between">
                <span className="text-xl font-black text-white">Total</span>
                <span className="text-2xl font-black text-red-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de livraison */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span>Livraison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Livraison standard (3-5 jours ouvrés)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Suivi de commande par email</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Livraison gratuite à partir de 100€</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Garanties */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span>Garanties</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Retour gratuit sous 30 jours</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Garantie constructeur</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Paiement 100% sécurisé</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code promo */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Code promo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Entrez votre code"
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
            />
            <Button 
              variant="outline"
              className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 px-6 py-3 rounded-xl transition-all duration-300"
            >
              Appliquer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
