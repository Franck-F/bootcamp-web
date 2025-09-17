"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, TrendingUp, Package, Euro, Plus, Edit, Eye } from "lucide-react"
import { mockProducts, mockOrders } from "@/lib/mock-data"

export function SellerDashboard() {
  const totalProducts = mockProducts.length
  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)

  const stats = [
    {
      title: "Mes ventes",
      value: `${totalRevenue.toFixed(2)}€`,
      description: "Ce mois-ci",
      icon: Euro,
    },
    {
      title: "Commandes",
      value: totalOrders.toString(),
      description: "À traiter",
      icon: ShoppingBag,
    },
    {
      title: "Mes produits",
      value: totalProducts.toString(),
      description: "En ligne",
      icon: Package,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Espace vendeur</h1>
            <p className="text-muted-foreground">Gérez vos produits et commandes</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
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
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mes produits</CardTitle>
            <CardDescription>Gérez votre catalogue de sneakers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold">{product.price}€</span>
                        {product.onSale && (
                          <Badge variant="destructive" className="text-xs">
                            -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {product.sizes.reduce((total, size) => total + size.stock, 0)} en stock
                      </p>
                      <p className="text-xs text-muted-foreground">{product.sizes.length} tailles disponibles</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes à traiter</CardTitle>
            <CardDescription>Suivez et gérez vos ventes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Commande {order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} article(s) - {order.total.toFixed(2)}€
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{order.createdAt.toLocaleDateString("fr-FR")}</p>
                  </div>

                  <div className="flex items-center gap-4">
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

                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
