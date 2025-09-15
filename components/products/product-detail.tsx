"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Share, Minus, Plus, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, isInCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const selectedSizeStock = product.sizes.find((s) => s.size === selectedSize)?.stock || 0
  const isInStock = selectedSizeStock > 0
  const canAddToCart = selectedSize && isInStock && quantity <= selectedSizeStock
  const alreadyInCart = selectedSize && isInCart(product.id, selectedSize, selectedColor)

  const handleAddToCart = async () => {
    if (!canAddToCart) return

    setIsAdding(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    addItem(product.id, selectedSize, quantity, selectedColor)
    setShowSuccess(true)
    setIsAdding(false)

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>Produit ajouté au panier !</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">
          Produits
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <Badge variant="default">Nouveau</Badge>}
              {product.onSale && (
                <Badge variant="destructive">
                  -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                </Badge>
              )}
            </div>

            {/* Share button */}
            <Button size="icon" variant="secondary" className="absolute top-4 right-4">
              <Share className="h-4 w-4" />
            </Button>
          </div>

          {/* Thumbnail images */}
          <div className="flex gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8) • 127 avis</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold">{product.price}€</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">{product.originalPrice}€</span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Couleur: {selectedColor}</Label>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition-colors ${
                    selectedColor === color ? "border-primary" : "border-muted"
                  }`}
                  style={{
                    backgroundColor: color.includes("Noir") ? "#000" : color.includes("Blanc") ? "#fff" : "#8b5cf6",
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Pointure</Label>
              <Link href="/guide-tailles" className="text-sm text-primary hover:underline">
                Guide des tailles
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sizeOption) => (
                <button
                  key={sizeOption.size}
                  onClick={() => setSelectedSize(sizeOption.size)}
                  disabled={sizeOption.stock === 0}
                  className={`h-12 border rounded-lg text-sm font-medium transition-colors ${
                    selectedSize === sizeOption.size
                      ? "border-primary bg-primary text-primary-foreground"
                      : sizeOption.stock === 0
                        ? "border-muted bg-muted text-muted-foreground cursor-not-allowed"
                        : "border-border hover:border-primary"
                  }`}
                >
                  {sizeOption.size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-xs text-muted-foreground">
                {selectedSizeStock} paire{selectedSizeStock > 1 ? "s" : ""} disponible{selectedSizeStock > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quantité</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                disabled={quantity >= selectedSizeStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3">
            <Button className="flex-1" disabled={!canAddToCart || isAdding} size="lg" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              {isAdding
                ? "Ajout en cours..."
                : alreadyInCart
                  ? "Ajouter encore"
                  : !selectedSize
                    ? "Choisir une taille"
                    : !isInStock
                      ? "Rupture de stock"
                      : "Ajouter au panier"}
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center space-y-2">
              <Truck className="h-6 w-6 mx-auto text-primary" />
              <div>
                <p className="text-sm font-medium">Livraison gratuite</p>
                <p className="text-xs text-muted-foreground">Dès 100€</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <RotateCcw className="h-6 w-6 mx-auto text-primary" />
              <div>
                <p className="text-sm font-medium">Retour gratuit</p>
                <p className="text-xs text-muted-foreground">30 jours</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <Shield className="h-6 w-6 mx-auto text-primary" />
              <div>
                <p className="text-sm font-medium">Authenticité</p>
                <p className="text-xs text-muted-foreground">Garantie 100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Caractéristiques</TabsTrigger>
            <TabsTrigger value="reviews">Avis (127)</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Cette sneaker iconique combine style et performance pour un look authentique et moderne. Conçue avec
                    des matériaux premium et une attention particulière aux détails, elle offre un confort exceptionnel
                    pour un usage quotidien.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Détails produit</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Marque:</span>
                        <span>{product.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Catégorie:</span>
                        <span className="capitalize">
                          {product.category === "men" ? "Homme" : product.category === "women" ? "Femme" : "Enfant"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Couleurs disponibles:</span>
                        <span>{product.colors.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tailles disponibles:</span>
                        <span>{product.sizes.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Matériaux</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tige:</span>
                        <span>Cuir premium</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doublure:</span>
                        <span>Textile respirant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Semelle:</span>
                        <span>Caoutchouc antidérapant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">4.8</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">127 avis</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-2">{rating}</span>
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <div className="flex-1 h-2 bg-muted rounded-full">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {rating === 5 ? 89 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 3 : 2}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    {/* Sample reviews */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="font-medium">Marie L.</span>
                        <span className="text-sm text-muted-foreground">• Il y a 2 jours</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Excellente qualité, très confortable et le style est parfait. Je recommande vivement !
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                          ))}
                          <Star className="h-3 w-3 text-muted" />
                        </div>
                        <span className="font-medium">Thomas R.</span>
                        <span className="text-sm text-muted-foreground">• Il y a 1 semaine</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Très satisfait de mon achat. La livraison était rapide et le produit correspond parfaitement à
                        la description.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
