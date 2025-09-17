"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import { redirect } from "next/navigation"
import Image from "next/image"

// Mock data pour les commandes
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 189.99,
    items: [
      {
        id: "1",
        name: "Nike Air Max 90",
        size: "42",
        quantity: 1,
        price: 189.99,
        image: "/nike-air-max-90.jpg",
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    status: "shipped",
    total: 299.98,
    items: [
      {
        id: "2",
        name: "Adidas Ultraboost 22",
        size: "41",
        quantity: 1,
        price: 149.99,
        image: "/adidas-ultraboost.jpg",
      },
      {
        id: "3",
        name: "Jordan 1 Retro High",
        size: "42",
        quantity: 1,
        price: 149.99,
        image: "/jordan-1-retro.jpg",
      },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-01-25",
    status: "processing",
    total: 219.99,
    items: [
      {
        id: "4",
        name: "New Balance 990v5",
        size: "43",
        quantity: 1,
        price: 219.99,
        image: "/new-balance-990.jpg",
      },
    ],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "processing":
      return <Package className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "delivered":
      return "Livré"
    case "shipped":
      return "Expédié"
    case "processing":
      return "En préparation"
    default:
      return "En attente"
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "delivered":
      return "default"
    case "shipped":
      return "secondary"
    case "processing":
      return "outline"
    default:
      return "outline"
  }
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Mes Commandes</h1>
        <p className="text-muted-foreground mt-2">Suivez l'état de vos commandes et consultez votre historique</p>
      </div>

      <div className="space-y-6">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Commande {order.id}</CardTitle>
                  <CardDescription>Passée le {new Date(order.date).toLocaleDateString("fr-FR")}</CardDescription>
                </div>
                <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Taille: {item.size} • Quantité: {item.quantity}
                        </p>
                        <p className="font-medium">€{item.price}</p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">Total: €{order.total}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Voir les détails
                    </Button>
                    {order.status === "delivered" && <Button size="sm">Laisser un avis</Button>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
