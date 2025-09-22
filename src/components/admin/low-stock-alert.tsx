'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Package, Plus } from 'lucide-react'

interface LowStockItem {
  id: string
  productName: string
  brand: string
  size: string
  currentStock: number
  minThreshold: number
  image: string
}

export function LowStockAlert() {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLowStockItems()
  }, [])

  const fetchLowStockItems = async () => {
    try {
      // Simulation de données - en production, appeler l'API
      setLowStockItems([
        {
          id: '1',
          productName: 'Air Jordan 1 Retro High OG',
          brand: 'Jordan',
          size: '42',
          currentStock: 2,
          minThreshold: 5,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100',
        },
        {
          id: '2',
          productName: 'Nike Air Max 270',
          brand: 'Nike',
          size: '38',
          currentStock: 1,
          minThreshold: 5,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
        },
        {
          id: '3',
          productName: 'Adidas Ultraboost 22',
          brand: 'Adidas',
          size: '41',
          currentStock: 0,
          minThreshold: 5,
          image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100',
        },
        {
          id: '4',
          productName: 'Converse Chuck Taylor',
          brand: 'Converse',
          size: '36',
          currentStock: 3,
          minThreshold: 5,
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=100',
        },
      ])
    } catch (error) {
      console.error('Erreur lors du chargement des stocks faibles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockBadge = (currentStock: number, minThreshold: number) => {
    if (currentStock === 0) {
      return <Badge variant="destructive">Rupture</Badge>
    } else if (currentStock < minThreshold) {
      return <Badge variant="secondary">Stock faible</Badge>
    }
    return <Badge variant="success">En stock</Badge>
  }

  const getStockColor = (currentStock: number, minThreshold: number) => {
    if (currentStock === 0) return 'text-red-600'
    if (currentStock < minThreshold) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertes de stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
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
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span>Alertes de stock</span>
        </CardTitle>
        <Button variant="outline" size="sm">
          Gérer les stocks
        </Button>
      </CardHeader>
      <CardContent>
        {lowStockItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-600">Tous les stocks sont suffisants</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 relative">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-600">{item.brand} - Taille {item.size}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm font-medium ${getStockColor(item.currentStock, item.minThreshold)}`}>
                        {item.currentStock} en stock
                      </span>
                      {getStockBadge(item.currentStock, item.minThreshold)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Réapprovisionner
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {lowStockItems.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                {lowStockItems.length} produit(s) nécessitent un réapprovisionnement
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
