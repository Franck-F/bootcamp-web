'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Calendar, 
  Euro, 
  Eye, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react'
import { generateOrderNumber, generateMockCreationDate, generateMockUpdateDate } from '@/lib/date-utils'

interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage: string
  size: string
  color: string
  quantity: number
  price: number
}

interface Order {
  id: number
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  total: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  trackingNumber?: string
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      // Simuler les données des commandes (en production, récupérer depuis l'API)
      setOrders([
        {
          id: 1,
          orderNumber: generateOrderNumber(),
          status: 'delivered',
          paymentStatus: 'paid',
          total: 405.00,
          createdAt: generateMockCreationDate(15),
          updatedAt: generateMockUpdateDate(12),
          trackingNumber: 'TRK123456789',
          shippingAddress: {
            name: 'Jean Dupont',
            address: '123 Rue de la Mode',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          items: [
            {
              id: 1,
              productId: 1,
              productName: 'Nike Air Force 1 \'Camo\'',
              productImage: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/products/main-square_107628ca-8acc-4f95-9a58-1922e8c31518.jpg?v=1695974200',
              size: 'EU 44',
              color: 'Noir',
              quantity: 1,
              price: 405.00
            }
          ]
        },
        {
          id: 2,
          orderNumber: generateOrderNumber(),
          status: 'shipped',
          paymentStatus: 'paid',
          total: 299.00,
          createdAt: generateMockCreationDate(10),
          updatedAt: generateMockUpdateDate(8),
          trackingNumber: 'TRK987654321',
          shippingAddress: {
            name: 'Jean Dupont',
            address: '123 Rue de la Mode',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          items: [
            {
              id: 2,
              productId: 2,
              productName: 'Nike KD 7 \'Away\'',
              productImage: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_43f9b61e-dc1b-4896-913f-427ec0e5927a.jpg?v=1723599056',
              size: 'EU 43',
              color: 'Blanc',
              quantity: 1,
              price: 299.00
            }
          ]
        },
        {
          id: 3,
          orderNumber: generateOrderNumber(),
          status: 'processing',
          paymentStatus: 'paid',
          total: 189.00,
          createdAt: generateMockCreationDate(5),
          updatedAt: generateMockUpdateDate(5),
          shippingAddress: {
            name: 'Jean Dupont',
            address: '123 Rue de la Mode',
            city: 'Paris',
            postalCode: '75001',
            country: 'France'
          },
          items: [
            {
              id: 3,
              productId: 3,
              productName: 'Nike Air Max Zero Essential',
              productImage: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_3a1ff23a-ce11-48e5-9123-4c8e4988e3d7.jpg?v=1708692802',
              size: 'EU 42',
              color: 'Gris',
              quantity: 1,
              price: 189.00
            }
          ]
        }
      ])
      setLoading(false)
    }
  }, [session, status, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" />Livré</Badge>
      case 'shipped':
        return <Badge className="bg-blue-600 text-white"><Truck className="w-3 h-3 mr-1" />Expédié</Badge>
      case 'processing':
        return <Badge className="bg-yellow-600 text-white"><Clock className="w-3 h-3 mr-1" />En cours</Badge>
      case 'pending':
        return <Badge className="bg-orange-600 text-white"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>
      case 'cancelled':
        return <Badge className="bg-red-600 text-white"><XCircle className="w-3 h-3 mr-1" />Annulé</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600 text-white">Payé</Badge>
      case 'pending':
        return <Badge className="bg-yellow-600 text-white">En attente</Badge>
      case 'failed':
        return <Badge className="bg-red-600 text-white">Échoué</Badge>
      case 'refunded':
        return <Badge className="bg-blue-600 text-white">Remboursé</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[90%] mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mes Commandes</h1>
            <p className="text-gray-400">Suivez l'état de vos commandes</p>
          </div>

          {orders.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Aucune commande</h3>
                <p className="text-gray-400 mb-6">Vous n'avez pas encore passé de commande.</p>
                <Link href="/products">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Découvrir nos produits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          <Package className="w-5 h-5 mr-2" />
                          Commande {order.orderNumber}
                        </CardTitle>
                        <p className="text-gray-400 text-sm mt-1">
                          Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Articles */}
                      <div className="lg:col-span-2">
                        <h4 className="text-white font-semibold mb-4">Articles commandés</h4>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-full h-full object-contain p-2"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-white font-medium">{item.productName}</h5>
                                <p className="text-gray-400 text-sm">
                                  Taille: {item.size} • Couleur: {item.color} • Quantité: {item.quantity}
                                </p>
                              </div>
                              <div className="text-white font-semibold">
                                {item.price.toFixed(2)} €
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Informations de livraison et total */}
                      <div>
                        <h4 className="text-white font-semibold mb-4">Informations</h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-gray-300 text-sm font-medium mb-2">Adresse de livraison</h5>
                            <div className="text-white text-sm">
                              <div>{order.shippingAddress.name}</div>
                              <div>{order.shippingAddress.address}</div>
                              <div>{order.shippingAddress.postalCode} {order.shippingAddress.city}</div>
                              <div>{order.shippingAddress.country}</div>
                            </div>
                          </div>

                          {order.trackingNumber && (
                            <div>
                              <h5 className="text-gray-300 text-sm font-medium mb-2">Numéro de suivi</h5>
                              <div className="text-white text-sm font-mono bg-gray-800 px-3 py-2 rounded">
                                {order.trackingNumber}
                              </div>
                            </div>
                          )}

                          <div className="border-t border-gray-700 pt-4">
                            <div className="flex items-center justify-between text-white font-semibold text-lg">
                              <span>Total</span>
                              <span className="flex items-center">
                                <Euro className="w-4 h-4 mr-1" />
                                {order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="pt-4">
                            <Link href={`/orders/${order.id}`}>
                              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                                <Eye className="w-4 h-4 mr-2" />
                                Voir les détails
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
