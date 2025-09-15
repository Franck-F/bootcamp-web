"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/components/auth/auth-provider"

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface PaymentMethod {
  type: "card" | "paypal" | "apple_pay"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardName?: string
}

export function CheckoutPage() {
  const { itemsWithProducts, totalItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string>("")

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "card",
  })

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptNewsletter, setAcceptNewsletter] = useState(false)

  const shippingCost = totalPrice >= 100 ? 0 : 9.99
  const finalTotal = totalPrice + shippingCost

  if (itemsWithProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-2xl font-bold">Votre panier est vide</h1>
          <p className="text-muted-foreground">Ajoutez des produits avant de passer commande</p>
          <Button asChild>
            <Link href="/products">Découvrir nos produits</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate order ID
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`
    setOrderId(newOrderId)

    // Clear cart and show confirmation
    clearCart()
    setStep("confirmation")
    setIsProcessing(false)
  }

  const handleBackToShopping = () => {
    router.push("/products")
  }

  if (step === "confirmation") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          <div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Commande confirmée !</h1>
            <p className="text-muted-foreground">Merci pour votre achat</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Numéro de commande:</span>
                <span className="font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total payé:</span>
                <span className="font-bold">{finalTotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email de confirmation:</span>
                <span>{shippingAddress.email}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Un email de confirmation a été envoyé à {shippingAddress.email}
            </p>
            <p className="text-sm text-muted-foreground">Livraison estimée: 2-3 jours ouvrés</p>
          </div>

          <Button onClick={handleBackToShopping}>Continuer mes achats</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === "shipping" ? "text-primary" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Livraison</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={`flex items-center ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Paiement</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div>
            {step === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse *</Label>
                      <Textarea
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input
                          id="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" asChild>
                        <Link href="/cart">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Retour au panier
                        </Link>
                      </Button>
                      <Button type="submit">Continuer vers le paiement</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Méthode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <RadioGroup
                      value={paymentMethod.type}
                      onValueChange={(value: "card" | "paypal" | "apple_pay") =>
                        setPaymentMethod({ ...paymentMethod, type: value })
                      }
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>Carte bancaire</span>
                            <div className="flex gap-2">
                              <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                VISA
                              </div>
                              <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                MC
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                        <RadioGroupItem value="paypal" id="paypal" disabled />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>PayPal (Bientôt disponible)</span>
                            <div className="w-12 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                              PayPal
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod.type === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nom sur la carte *</Label>
                          <Input
                            id="cardName"
                            value={paymentMethod.cardName || ""}
                            onChange={(e) => setPaymentMethod({ ...paymentMethod, cardName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Numéro de carte *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentMethod.cardNumber || ""}
                            onChange={(e) => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Date d'expiration *</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/AA"
                              value={paymentMethod.expiryDate || ""}
                              onChange={(e) => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentMethod.cvv || ""}
                              onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
                        <Label htmlFor="terms" className="text-sm">
                          J'accepte les{" "}
                          <Link href="/cgv" className="text-primary hover:underline">
                            conditions générales de vente
                          </Link>{" "}
                          et la{" "}
                          <Link href="/confidentialite" className="text-primary hover:underline">
                            politique de confidentialité
                          </Link>{" "}
                          *
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" checked={acceptNewsletter} onCheckedChange={setAcceptNewsletter} />
                        <Label htmlFor="newsletter" className="text-sm">
                          Je souhaite recevoir les offres et nouveautés par email
                        </Label>
                      </div>
                    </div>

                    {!acceptTerms && (
                      <Alert>
                        <AlertDescription>
                          Vous devez accepter les conditions générales pour continuer.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep("shipping")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                      </Button>
                      <Button type="submit" disabled={!acceptTerms || isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          `Payer ${finalTotal.toFixed(2)}€`
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {itemsWithProducts.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            T{item.size}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.color}
                          </Badge>
                          <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{(item.product.price * item.quantity).toFixed(2)}€</div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{totalPrice.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{shippingCost === 0 ? "Gratuite" : `${shippingCost.toFixed(2)}€`}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)}€</span>
                </div>

                {/* Security badges */}
                <div className="pt-4 space-y-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Paiement 100% sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Livraison sous 2-3 jours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
