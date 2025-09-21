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
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  RefreshCw
} from 'lucide-react'

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
  subtotal: number
  shipping: number
  tax: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
    phone?: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      // Simuler les données de la commande (en production, récupérer depuis l'API)
      setOrder({
        id: parseInt(params.id),
        orderNumber: 'CMD-2024-001',
        status: 'delivered',
        paymentStatus: 'paid',
        total: 405.00,
        subtotal: 337.50,
        shipping: 9.99,
        tax: 67.50,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-18T14:20:00Z',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-20T00:00:00Z',
        shippingAddress: {
          name: 'Jean Dupont',
          address: '123 Rue de la Mode',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
          phone: '+33 6 12 34 56 78'
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
      })
      setLoading(false)
    }
  }, [session, status, router, params.id])

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

  if (!order) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Commande non trouvée</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/orders">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux commandes
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Commande {order.orderNumber}</h1>
                <p className="text-gray-400">
                  Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} à {new Date(order.createdAt).toLocaleTimeString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {getStatusBadge(order.status)}
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles commandés */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Articles commandés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white font-semibold">{item.productName}</h5>
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
                </CardContent>
              </Card>

              {/* Suivi de livraison */}
              {order.trackingNumber && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Suivi de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Numéro de suivi</h4>
                          <p className="text-gray-400 text-sm font-mono">{order.trackingNumber}</p>
                        </div>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Actualiser
                        </Button>
                      </div>
                      
                      {order.estimatedDelivery && (
                        <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <p className="text-blue-200">
                              Livraison estimée: {new Date(order.estimatedDelivery).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Informations de livraison et facturation */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-white font-medium">{order.shippingAddress.name}</p>
                    <p className="text-gray-300">{order.shippingAddress.address}</p>
                    <p className="text-gray-300">
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </p>
                    <p className="text-gray-300">{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-300">{order.shippingAddress.phone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Euro className="w-5 h-5 mr-2" />
                    Résumé de la commande
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sous-total</span>
                      <span className="text-white">{order.subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Livraison</span>
                      <span className="text-white">{order.shipping.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">TVA</span>
                      <span className="text-white">{order.tax.toFixed(2)} €</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold text-lg">Total</span>
                        <span className="text-white font-bold text-lg">{order.total.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger la facture
                  </Button>
                  
                  {order.status === 'delivered' && (
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retourner un article
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter le support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
