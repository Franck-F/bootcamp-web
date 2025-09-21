'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Users, 
  Package, 
  Euro,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface Stats {
  totalSales: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  salesGrowth: number
  ordersGrowth: number
  usersGrowth: number
  productsGrowth: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
    productsGrowth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Simulation de données - en production, appeler l'API
      setStats({
        totalSales: 45680,
        totalOrders: 1247,
        totalUsers: 892,
        totalProducts: 156,
        salesGrowth: 12.5,
        ordersGrowth: 8.3,
        usersGrowth: 15.2,
        productsGrowth: -2.1,
      })
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Chiffre d'affaires */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {getGrowthIcon(stats.salesGrowth)}
            <span className={getGrowthColor(stats.salesGrowth)}>
              {stats.salesGrowth > 0 ? '+' : ''}{stats.salesGrowth}%
            </span>
            <span>vs mois dernier</span>
          </div>
        </CardContent>
      </Card>

      {/* Commandes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commandes</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalOrders)}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {getGrowthIcon(stats.ordersGrowth)}
            <span className={getGrowthColor(stats.ordersGrowth)}>
              {stats.ordersGrowth > 0 ? '+' : ''}{stats.ordersGrowth}%
            </span>
            <span>vs mois dernier</span>
          </div>
        </CardContent>
      </Card>

      {/* Utilisateurs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {getGrowthIcon(stats.usersGrowth)}
            <span className={getGrowthColor(stats.usersGrowth)}>
              {stats.usersGrowth > 0 ? '+' : ''}{stats.usersGrowth}%
            </span>
            <span>vs mois dernier</span>
          </div>
        </CardContent>
      </Card>

      {/* Produits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produits</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalProducts)}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {getGrowthIcon(stats.productsGrowth)}
            <span className={getGrowthColor(stats.productsGrowth)}>
              {stats.productsGrowth > 0 ? '+' : ''}{stats.productsGrowth}%
            </span>
            <span>vs mois dernier</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
