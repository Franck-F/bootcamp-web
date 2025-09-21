'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { PaymentForm } from '@/components/checkout/payment-form'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, Truck, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

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

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchCartItems()
  }, [session, router])

  const fetchCartItems = async () => {
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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }

  const calculateShipping = (subtotal: number) => {
    return subtotal >= 100 ? 0 : 9.99
  }

  const calculateTax = (subtotal: number, shipping: number) => {
    return Math.round((subtotal + shipping) * 0.20 * 100) / 100
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = calculateShipping(subtotal)
    const tax = calculateTax(subtotal, shipping)
    return subtotal + shipping + tax
  }

  const handlePlaceOrder = async (orderData: any) => {
    setProcessing(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          address: orderData.address,
          paymentMethod: orderData.paymentMethod,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        toast.success('Commande passée avec succès !')
        router.push(`/orders/${order.id}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la commande')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">Ajoutez des produits à votre panier avant de passer commande.</p>
            <Button onClick={() => router.push('/products')}>
              Continuer mes achats
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const steps = [
    { id: 1, name: 'Livraison', icon: Truck },
    { id: 2, name: 'Paiement', icon: CreditCard },
    { id: 3, name: 'Confirmation', icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isActive 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <CheckoutForm
                onNext={(data) => {
                  // Store form data and move to next step
                  setCurrentStep(2)
                }}
              />
            )}
            
            {currentStep === 2 && (
              <PaymentForm
                onNext={(data) => {
                  // Store payment data and move to next step
                  setCurrentStep(3)
                }}
                onBack={() => setCurrentStep(1)}
              />
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Confirmation de commande</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Votre commande est prête !
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Vérifiez les détails ci-dessous et confirmez votre commande.
                      </p>
                      <Button
                        size="lg"
                        onClick={handlePlaceOrder}
                        disabled={processing}
                        className="w-full"
                      >
                        {processing ? 'Traitement...' : 'Confirmer la commande'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={calculateSubtotal()}
              shipping={calculateShipping(calculateSubtotal())}
              tax={calculateTax(calculateSubtotal(), calculateShipping(calculateSubtotal()))}
              total={calculateTotal()}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
