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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Résumé de la commande</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.productId}-${item.size}-${index}`} className="flex items-center space-x-4">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={item.product?.images[0] || '/images/placeholder-sneaker.jpg'}
                    alt={item.product?.name || 'Produit'}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {item.product?.name || 'Produit'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.product?.brand || 'Marque'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Taille: {item.size}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantité: {item.quantity}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Détails des coûts */}
      <Card>
        <CardHeader>
          <CardTitle>Détails des coûts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <Badge variant="success">Gratuite</Badge>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">TVA (20%)</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de livraison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5" />
            <span>Livraison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Livraison standard (3-5 jours ouvrés)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Suivi de commande par email</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Livraison gratuite à partir de 100€</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Garanties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Garanties</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Retour gratuit sous 30 jours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Garantie constructeur</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Paiement 100% sécurisé</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code promo */}
      <Card>
        <CardHeader>
          <CardTitle>Code promo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Entrez votre code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button variant="outline">Appliquer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
