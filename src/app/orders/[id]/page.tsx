'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  Calendar,
  Download,
  ArrowLeft,
  Mail,
  Phone
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface OrderItem {
  id: number
  productName: string
  brand?: string
  size: string
  quantity: number
  unitPrice: number
  image?: string
}

interface Order {
  id: number
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  createdAt: string
  shippingAddress: any
  items: OrderItem[]
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchOrder()
  }, [session, router, params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        toast.error('Commande non trouvée')
        router.push('/orders')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error)
      toast.error('Erreur lors du chargement de la commande')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'En cours', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
      failed: { label: 'Échoué', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'Remboursé', color: 'bg-gray-100 text-gray-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const handleDownloadInvoice = () => {
    // Simuler le téléchargement de la facture
    toast.success('Facture téléchargée')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h1>
            <Button onClick={() => router.push('/orders')}>
              Retour aux commandes
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de confirmation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 mb-4">
            Merci pour votre commande. Nous avons reçu votre paiement et nous préparons votre colis.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-500">Numéro de commande:</span>
            <span className="font-mono text-lg font-bold text-blue-600">
              {order.orderNumber}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut de la commande */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Statut de la commande</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <div className="mt-1">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Paiement</label>
                    <div className="mt-1">
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles commandés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Articles commandés</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={item.image || '/images/placeholder-sneaker.jpg'}
                          alt={item.productName}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.productName}
                        </h3>
                        {item.brand && (
                          <p className="text-sm text-gray-600">
                            {item.brand}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Taille: {item.size} • Quantité: {item.quantity}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Adresse de livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Adresse de livraison</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shippingAddress && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    {order.shippingAddress.company && (
                      <p>{order.shippingAddress.company}</p>
                    )}
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && (
                      <p>{order.shippingAddress.address2}</p>
                    )}
                    <p>
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="mt-2 flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{order.shippingAddress.phone}</span>
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-medium">
                      {order.shipping === 0 ? 'Gratuite' : formatPrice(order.shipping)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA (20%)</span>
                    <span className="font-medium">{formatPrice(order.tax)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={handleDownloadInvoice}
                    variant="outline" 
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger la facture
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/orders')}
                    variant="outline" 
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Mes commandes
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/products')}
                    className="w-full"
                  >
                    Continuer mes achats
                  </Button>
                </div>

                {/* Informations de suivi */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Suivi de commande
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Vous recevrez un email de confirmation avec les détails de suivi 
                    dès que votre commande sera expédiée.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}