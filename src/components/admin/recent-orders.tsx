'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Eye, Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import { order_status, payment_status } from '@prisma/client'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  totalAmount: number
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentOrders()
  }, [])

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=5')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'secondary' as const, label: 'En attente', icon: Clock },
      'confirmed': { variant: 'default' as const, label: 'Confirmée', icon: CheckCircle },
      'processing': { variant: 'default' as const, label: 'En cours', icon: Package },
      'shipped': { variant: 'default' as const, label: 'Expédiée', icon: Package },
      'delivered': { variant: 'success' as const, label: 'Livrée', icon: CheckCircle },
      'cancelled': { variant: 'destructive' as const, label: 'Annulée', icon: XCircle },
      'refunded': { variant: 'destructive' as const, label: 'Remboursée', icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending']
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { variant: 'secondary' as const, label: 'En attente' },
      'paid': { variant: 'success' as const, label: 'Payé' },
      'failed': { variant: 'destructive' as const, label: 'Échoué' },
      'refunded': { variant: 'destructive' as const, label: 'Remboursé' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending']

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Commandes récentes</CardTitle>
        <Button variant="outline" size="sm">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune commande récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(new Date(order.createdAt))}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</p>
                  <div className="mt-1">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
