import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingBag, Star } from "lucide-react"
import Image from "next/image"
import { mockProducts } from "@/lib/mock-data"

export function FeaturedProducts() {
  const featuredProducts = mockProducts.filter((product) => product.featured)

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="w-fit mx-auto">
            Sélection Premium
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Nos coups de cœur</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Une sélection rigoureuse des sneakers les plus emblématiques et recherchées du moment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
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

                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick add to cart */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button className="w-full" size="sm">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">(4.8)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{product.price}€</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}€</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {product.sizes.reduce((total, size) => total + size.stock, 0)} en stock
                    </div>
                    <div className="flex gap-1">
                      {product.colors.slice(0, 2).map((color, index) => (
                        <div
                          key={index}
                          className="h-4 w-4 rounded-full border-2 border-background shadow-sm"
                          style={{
                            backgroundColor: color.includes("Noir")
                              ? "#000"
                              : color.includes("Blanc")
                                ? "#fff"
                                : "#8b5cf6",
                          }}
                        />
                      ))}
                      {product.colors.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{product.colors.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Voir toute la collection
          </Button>
        </div>
      </div>
    </section>
  )
}
