'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReceiptDownload } from '@/components/receipt-download'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  CreditCard, 
  Download,
  ArrowLeft,
  Home,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Euro
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Order {
  id: number
  order_number: string
  status: string
  total_amount: number
  created_at: string
  users: {
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    postal_code?: string
    country?: string
  }
  order_items: Array<{
    id: number
    quantity: number
    unit_price: number
    variants: {
      size?: string
      color?: string
      products: {
        name: string
        brands: {
          name: string
        }
        categories: {
          name: string
        }
      }
    }
  }>
}

function CheckoutSuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    } else {
      setError('Aucune commande trouvée')
      setLoading(false)
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        setError('Erreur lors du chargement de la commande')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur lors du chargement de la commande')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'pending':
        return 'text-yellow-500'
      case 'shipped':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Commande confirmée'
      case 'pending':
        return 'En attente de traitement'
      case 'shipped':
        return 'Expédiée'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement de votre commande...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Erreur</h3>
            <p className="text-gray-400 mb-6">{error || 'Commande non trouvée'}</p>
            <Link href="/products">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Retour aux produits
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message de succès */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Commande Confirmée !
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Merci pour votre achat. Votre commande a été traitée avec succès.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <ReceiptDownload 
              orderId={order.id} 
              orderNumber={order.order_number}
              className="bg-green-600 hover:bg-green-700"
            />
            <Link href="/orders">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Package className="w-4 h-4 mr-2" />
                Mes commandes
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Détails de la commande */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Package className="w-5 h-5 mr-2 text-orange-500" />
                Détails de la Commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Numéro de commande</span>
                <span className="text-white font-semibold">{order.order_number}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Date</span>
                <span className="text-white">
                  {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Statut</span>
                <span className={`font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-bold text-lg">
                  {order.total_amount.toFixed(2)} €
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Informations de livraison */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-500" />
                Informations de Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-white font-medium">{order.users.name}</p>
                  <p className="text-gray-400">{order.users.email}</p>
                </div>
              </div>
              
              {order.users.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-white">{order.users.phone}</span>
                </div>
              )}
              
              {order.users.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white">{order.users.address}</p>
                    {order.users.city && (
                      <p className="text-gray-400">
                        {order.users.postal_code} {order.users.city}
                      </p>
                    )}
                    {order.users.country && (
                      <p className="text-gray-400">{order.users.country}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Articles commandés */}
        <Card className="bg-gray-900 border-gray-800 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="w-5 h-5 mr-2 text-orange-500" />
              Articles Commandés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      {item.variants.products.brands.name} {item.variants.products.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {item.variants.products.categories.name}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      {item.variants.size && (
                        <span>Taille: {item.variants.size}</span>
                      )}
                      {item.variants.color && (
                        <span>Couleur: {item.variants.color}</span>
                      )}
                      <span>Quantité: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {(item.quantity * item.unit_price).toFixed(2)} €
                    </p>
                    <p className="text-gray-400 text-sm">
                      {item.unit_price.toFixed(2)} € / unité
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Link href="/products">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Home className="w-4 h-4 mr-2" />
              Continuer mes achats
            </Button>
          </Link>
          
          <Link href="/orders">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Package className="w-4 h-4 mr-2" />
              Voir toutes mes commandes
            </Button>
          </Link>
          
          <ReceiptDownload 
            orderId={order.id} 
            orderNumber={order.order_number}
            className="bg-green-600 hover:bg-green-700"
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CheckoutSuccessPageContent />
    </Suspense>
  )
}
