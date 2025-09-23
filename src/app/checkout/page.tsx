'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Package } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { PaymentForm } from '@/components/checkout/payment-form'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, Truck, Shield, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '@/store/cart-context'
import '@/styles/checkout-dark.css'

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
  const { state, getSubtotal, getTax, getShipping, getTotalPrice, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<any>({})
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    // Rediriger si le panier est vide
    if (state.items.length === 0) {
      router.push('/products')
      return
    }
  }, [session, router, state.items.length])

  const handleStepNext = (stepData: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }))
    setCurrentStep((prev: number) => prev + 1)
  }

  const handleStepBack = () => {
    setCurrentStep((prev: number) => prev - 1)
  }

  const handlePlaceOrder = async () => {
    setProcessing(true)
    try {
      // Étape 1: Traiter le paiement
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: formData.paymentMethod,
          amount: getTotalPrice(),
        }),
      })

      const paymentResult = await paymentResponse.json()

      if (!paymentResult.success) {
        toast.error(paymentResult.error || 'Échec du paiement')
        return
      }

      toast.success('Paiement traité avec succès !')

      // Étape 2: Créer la commande
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: state.items,
          address: formData.address,
          paymentMethod: formData.paymentMethod,
          subtotal: getSubtotal(),
          tax: getTax(),
          shipping: getShipping(),
          total: getTotalPrice(),
          transactionId: paymentResult.transactionId,
        }),
      })

      if (orderResponse.ok) {
        const result = await orderResponse.json()
        toast.success('Commande passée avec succès !')
        
        // Vider le panier
        clearCart()
        
        // Rediriger vers la page de succès avec téléchargement du reçu
        router.push(`/checkout/success?orderId=${result.order.id}&orderNumber=${result.order.order_number}`)
      } else {
        const error = await orderResponse.json()
        toast.error(error.error || 'Erreur lors de la création de la commande')
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error)
      toast.error('Une erreur est survenue lors du traitement de votre commande')
    } finally {
      setProcessing(false)
    }
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border border-red-600/30"></div>
        </div>
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Votre panier est vide</h1>
            <p className="text-gray-400 mb-8 text-lg">Ajoutez des produits à votre panier avant de passer commande.</p>
            <Button 
              onClick={() => router.push('/products')}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
            >
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec titre stylé */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Finaliser votre commande
          </h1>
          <p className="text-gray-400 text-lg">
            Complétez votre achat en quelques étapes simples
          </p>
        </div>

        {/* Progress Steps modernisés */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg shadow-green-500/25' 
                      : isActive 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 border-red-500 text-white shadow-lg shadow-red-500/25' 
                        : 'bg-gray-800 border-gray-600 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-pulse opacity-30"></div>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-bold ${
                      isActive ? 'text-red-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-1 mx-6 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-700'
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
                onNext={handleStepNext}
              />
            )}
            
            {currentStep === 2 && (
              <PaymentForm
                onNext={handleStepNext}
                onBack={handleStepBack}
              />
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span>Confirmation de commande</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/25">
                          <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse opacity-30"></div>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3">
                        Votre commande est prête !
                      </h3>
                      <p className="text-gray-400 mb-8 text-lg">
                        Vérifiez les détails ci-dessous et confirmez votre commande.
                      </p>
                      <Button
                        size="lg"
                        onClick={handlePlaceOrder}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Traitement du paiement...
                          </>
                        ) : (
                          'Confirmer la commande'
                        )}
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
              cartItems={state.items}
              subtotal={getSubtotal()}
              shipping={getShipping()}
              tax={getTax()}
              total={getTotalPrice()}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
