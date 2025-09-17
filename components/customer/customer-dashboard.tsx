"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, User, Package, Star, CreditCard, MapPin, Clock } from "lucide-react"
import { mockOrders, mockProducts } from "@/lib/mock-data"
import Link from "next/link"

export function CustomerDashboard() {
  const recentOrders = mockOrders.slice(0, 3)
  const favoriteProducts = mockProducts.filter((product) => product.featured).slice(0, 4)
  const totalOrders = mockOrders.length
  const totalSpent = mockOrders.reduce((sum, order) => sum + order.total, 0)

  const stats = [
    {
      title: "Commandes totales",
      value: totalOrders.toString(),
      description: "Depuis votre inscription",
      icon: ShoppingBag,
    },
    {
      title: "Total dépensé",
      value: `${totalSpent.toFixed(2)}€`,
      description: "Sur toutes vos commandes",
      icon: CreditCard,
    },
    {
      title: "Produits favoris",
      value: favoriteProducts.length.toString(),
      description: "Dans votre wishlist",
      icon: Heart,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mon espace client</h1>
            <p className="text-muted-foreground">Bienvenue dans votre espace personnel SneakPeak</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continuer mes achats
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/wishlist">
                <Heart className="h-4 w-4 mr-2" />
                Ma wishlist
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes commandes récentes</CardTitle>
                  <CardDescription>Suivez l'état de vos dernières commandes</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders">Voir tout</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Commande {order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} article(s) - {order.total.toFixed(2)}€
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {order.createdAt.toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        order.status === "confirmed"
                          ? "default"
                          : order.status === "shipped"
                            ? "secondary"
                            : order.status === "delivered"
                              ? "default"
                              : "outline"
                      }
                    >
                      {order.status === "confirmed"
                        ? "Confirmée"
                        : order.status === "shipped"
                          ? "Expédiée"
                          : order.status === "delivered"
                            ? "Livrée"
                            : "En attente"}
                    </Badge>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucune commande récente</p>
                    <Button className="mt-4" asChild>
                      <Link href="/products">Découvrir nos produits</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Accédez rapidement à vos fonctionnalités préférées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Modifier mon profil
                </Link>
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/orders">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Mes commandes
                </Link>
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/wishlist">
                  <Heart className="h-4 w-4 mr-2" />
                  Ma liste de souhaits
                </Link>
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/settings">
                  <MapPin className="h-4 w-4 mr-2" />
                  Adresses de livraison
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Favorite Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vos produits favoris</CardTitle>
                <CardDescription>Les sneakers que vous adorez</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/wishlist">Voir ma wishlist</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{product.price}€</span>
                      {product.onSale && (
                        <Badge variant="destructive" className="text-xs">
                          -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {favoriteProducts.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun produit favori</h3>
                <p className="text-muted-foreground mb-4">
                  Ajoutez des produits à votre wishlist pour les retrouver ici
                </p>
                <Button asChild>
                  <Link href="/products">Découvrir nos sneakers</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
