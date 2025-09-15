"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ShoppingBag, TrendingUp, Package, Euro, Eye, Settings, BarChart3 } from "lucide-react"
import { mockProducts, mockOrders, mockUsers } from "@/lib/mock-data"

export function AdminDashboard() {
  const totalProducts = mockProducts.length
  const totalOrders = mockOrders.length
  const totalUsers = mockUsers.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)

  const lowStockProducts = mockProducts.filter(
    (product) => product.sizes.reduce((total, size) => total + size.stock, 0) < 10,
  )

  const stats = [
    {
      title: "Revenus totaux",
      value: `${totalRevenue.toFixed(2)}€`,
      description: "+12% par rapport au mois dernier",
      icon: Euro,
      trend: "up",
    },
    {
      title: "Commandes",
      value: totalOrders.toString(),
      description: "3 nouvelles aujourd'hui",
      icon: ShoppingBag,
      trend: "up",
    },
    {
      title: "Produits",
      value: totalProducts.toString(),
      description: "En stock et disponibles",
      icon: Package,
      trend: "stable",
    },
    {
      title: "Utilisateurs",
      value: totalUsers.toString(),
      description: "Clients et vendeurs",
      icon: Users,
      trend: "up",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
            <p className="text-muted-foreground">Vue d'ensemble de votre boutique SneakPeak</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Rapports
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Alerte stock faible
              </CardTitle>
              <CardDescription className="text-orange-700">
                {lowStockProducts.length} produit(s) avec moins de 10 unités en stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="outline" className="text-orange-800">
                      {product.sizes.reduce((total, size) => total + size.stock, 0)} restant(s)
                    </Badge>
                  </div>
                ))}
                {lowStockProducts.length > 3 && (
                  <p className="text-xs text-orange-600">+{lowStockProducts.length - 3} autre(s) produit(s)</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 mr-1 text-green-500" />}
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Gérez votre boutique efficacement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Ajouter un nouveau produit
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gérer les utilisateurs
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Voir toutes les commandes
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Analyser les performances
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Gestion RGPD
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>Dernières commandes à traiter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} article(s) - {order.total.toFixed(2)}€
                      </p>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des produits</CardTitle>
            <CardDescription>Gestion de votre catalogue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand} - {product.price}€
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.featured ? "default" : "outline"}>
                      {product.featured ? "Mis en avant" : "Standard"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {product.sizes.reduce((total, size) => total + size.stock, 0)} en stock
                    </span>
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
