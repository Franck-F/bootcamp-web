"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ArrowRight, Truck, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export function CartPage() {
  const { itemsWithProducts, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  const shippingCost = totalPrice >= 100 ? 0 : 9.99
  const finalTotal = totalPrice + shippingCost

  if (itemsWithProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
            <p className="text-muted-foreground">Découvrez notre collection de sneakers premium</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuer mes achats
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mon panier</h1>
          <p className="text-muted-foreground">
            {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
          </p>
        </div>
        <Button variant="outline" onClick={clearCart}>
          <Trash2 className="h-4 w-4 mr-2" />
          Vider le panier
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {itemsWithProducts.map((item) => (
            <Card key={`${item.productId}-${item.size}-${item.color}`}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors">{item.product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Taille {item.size}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.color}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">{(item.product.price * item.quantity).toFixed(2)}€</p>
                        <p className="text-sm text-muted-foreground">{item.product.price}€ / unité</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuer mes achats
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Sous-total ({totalItems} articles)</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>

              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{shippingCost === 0 ? "Gratuite" : `${shippingCost.toFixed(2)}€`}</span>
              </div>

              {totalPrice < 100 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Ajoutez {(100 - totalPrice).toFixed(2)}€ pour bénéficier de la livraison gratuite
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{finalTotal.toFixed(2)}€</span>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  Passer commande
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center">Paiement sécurisé • Livraison sous 2-3 jours</p>
            </CardContent>
          </Card>

          {/* Guarantees */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Livraison rapide</p>
                  <p className="text-xs text-muted-foreground">2-3 jours ouvrés</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Paiement sécurisé</p>
                  <p className="text-xs text-muted-foreground">SSL & 3D Secure</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ArrowLeft className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Retour gratuit</p>
                  <p className="text-xs text-muted-foreground">30 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
