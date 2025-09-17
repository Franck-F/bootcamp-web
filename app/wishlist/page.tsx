"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/lib/wishlist-context"

export default function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const { itemsWithProducts, removeItem } = useWishlist()

  if (!isAuthenticated) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Ma Liste de Souhaits</h1>
        <p className="text-muted-foreground mt-2">
          Retrouvez tous vos produits favoris ({itemsWithProducts.length} articles)
        </p>
      </div>

      {itemsWithProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Votre liste de souhaits est vide</h3>
          <p className="text-muted-foreground mb-6">
            Ajoutez des produits à votre liste de souhaits pour les retrouver facilement
          </p>
          <Button asChild>
            <Link href="/products">Découvrir nos produits</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {itemsWithProducts.map((item) => (
            <Card key={item.productId} className="group overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {item.product.originalPrice && (
                    <Badge variant="destructive" className="text-xs">
                      -
                      {Math.round(
                        ((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100,
                      )}
                      %
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {item.product.sizes.reduce((total, size) => total + size.stock, 0) === 0 && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Badge variant="outline" className="bg-background">
                      Rupture de stock
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{item.product.brand}</div>
                  <h3 className="font-medium text-sm leading-tight">{item.product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">€{item.product.price}</span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">€{item.product.originalPrice}</span>
                    )}
                  </div>
                  {item.product.sizes.reduce((total, size) => total + size.stock, 0) > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Tailles:{" "}
                      {item.product.sizes
                        .filter((s) => s.stock > 0)
                        .map((s) => s.size)
                        .join(", ")}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={item.product.sizes.reduce((total, size) => total + size.stock, 0) === 0}
                    asChild={item.product.sizes.reduce((total, size) => total + size.stock, 0) > 0}
                  >
                    {item.product.sizes.reduce((total, size) => total + size.stock, 0) > 0 ? (
                      <Link href={`/products/${item.productId}`}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Voir le produit
                      </Link>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Indisponible
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
