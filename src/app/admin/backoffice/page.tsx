'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Settings,
  Users,
  ShoppingCart,
  Euro,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface StockItem {
  id: number
  productName: string
  brand: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  price: number | string
  lastUpdated: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  sales: number
  revenue: number | string
  image: string
}

interface StockStats {
  totalProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalStockValue: number
  monthlySales: number
  topSelling: StockItem[]
  recentMovements: any[]
}

export default function BackofficePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [updatingStock, setUpdatingStock] = useState<number | null>(null)
  const [stats, setStats] = useState<StockStats | null>(null)
  const [mounted, setMounted] = useState(false)

  // Fonctions pour les actions
  const handleImportCSV = () => {
    if (typeof window !== 'undefined') {
      alert('Fonctionnalité d\'import CSV en cours de développement')
    }
  }

  const handleExport = () => {
    if (typeof window !== 'undefined') {
      alert('Fonctionnalité d\'export en cours de développement')
    }
  }

  const handleNewProduct = () => {
    if (typeof window !== 'undefined') {
      alert('Fonctionnalité d\'ajout de produit en cours de développement')
    }
  }

  const handleRefreshStock = () => {
    loadStockData()
  }

  const handleStockSettings = () => {
    if (typeof window !== 'undefined') {
      alert('Fonctionnalité de paramètres de stock en cours de développement')
    }
  }

  const handleViewProduct = (productId: number) => {
    if (typeof window !== 'undefined') {
      alert(`Voir le produit ${productId}`)
    }
  }

  const handleEditProduct = (productId: number) => {
    if (typeof window !== 'undefined') {
      alert(`Modifier le produit ${productId}`)
    }
  }

  const handleDeleteProduct = (productId: number) => {
    if (typeof window !== 'undefined') {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        alert(`Supprimer le produit ${productId}`)
      }
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      if (session.user.role !== 'admin') {
        router.push('/')
        return
      }
      loadStockData()
    }
  }, [session, status, router, mounted])

  const loadStockData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stock')
      if (response.ok) {
        const data = await response.json()
        setStockItems(data)
        
        // Calculer les statistiques
        const totalProducts = data.length
        const lowStockProducts = data.filter((item: StockItem) => item.status === 'low-stock').length
        const outOfStockProducts = data.filter((item: StockItem) => item.status === 'out-of-stock').length
        const totalStockValue = data.reduce((sum: number, item: StockItem) => sum + (item.currentStock * Number(item.price)), 0)
        
        // Calculer les ventes mensuelles (simulé)
        const monthlySales = data.reduce((sum: number, item: StockItem) => sum + item.sales * Number(item.price), 0)
        
        // Top 3 des produits les plus vendus
        const topSelling = data
          .sort((a: StockItem, b: StockItem) => b.sales - a.sales)
          .slice(0, 3)
        
        setStats({
          totalProducts,
          lowStockProducts,
          outOfStockProducts,
          totalStockValue,
          monthlySales,
          topSelling,
          recentMovements: [] // Pour l'instant vide, peut être implémenté plus tard
        })
      } else {
        // Fallback avec des données mockées en cas d'erreur
        const mockStockItems: StockItem[] = [
        {
          id: 1,
          productName: 'Nike Air Force 1 \'Camo\'',
          brand: 'Nike',
          category: 'Sneakers',
          currentStock: 45,
          minStock: 20,
          maxStock: 100,
          price: 405.00,
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in-stock',
          sales: 156,
          revenue: 63180,
          image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/products/main-square_107628ca-8acc-4f95-9a58-1922e8c31518.jpg?v=1695974200'
        },
        {
          id: 2,
          productName: 'Nike KD 7 \'Away\'',
          brand: 'Nike',
          category: 'Basketball',
          currentStock: 8,
          minStock: 15,
          maxStock: 80,
          price: 299.00,
          lastUpdated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'low-stock',
          sales: 89,
          revenue: 26611,
          image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_43f9b61e-dc1b-4896-913f-427ec0e5927a.jpg?v=1723599056'
        },
        {
          id: 3,
          productName: 'Nike Air Max Zero Essential',
          brand: 'Nike',
          category: 'Running',
          currentStock: 0,
          minStock: 10,
          maxStock: 60,
          price: 189.00,
          lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'out-of-stock',
          sales: 234,
          revenue: 44226,
          image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_3a1ff23a-ce11-48e5-9123-4c8e4988e3d7.jpg?v=1708692802'
        }
      ]

      const mockStats: StockStats = {
        totalProducts: 1247,
        lowStockProducts: 23,
        outOfStockProducts: 7,
        totalStockValue: 2847500,
        monthlySales: 156789,
        topSelling: mockStockItems.slice(0, 3),
        recentMovements: []
      }

        setStockItems(mockStockItems)
        setStats(mockStats)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-600 text-white">En stock</Badge>
      case 'low-stock':
        return <Badge className="bg-yellow-600 text-white">Stock faible</Badge>
      case 'out-of-stock':
        return <Badge className="bg-red-600 text-white">Rupture</Badge>
      default:
        return <Badge className="bg-gray-600 text-white">{status}</Badge>
    }
  }

  const updateStock = async (variantId: number, newStock: number) => {
    try {
      setUpdatingStock(variantId)
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
          stock: newStock
        })
      })

      if (response.ok) {
        // Recharger les données
        await loadStockData()
      } else {
        console.error('Erreur lors de la mise à jour du stock')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error)
    } finally {
      setUpdatingStock(null)
    }
  }

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[90%] mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Backoffice de Gestion</h1>
                <p className="text-gray-400">Gestion avancée du stock et des produits</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={handleImportCSV} className="bg-green-600 hover:bg-green-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
                <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handleNewProduct} className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau produit
                </Button>
              </div>
            </div>
          </div>

          {/* Statistiques principales */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-600/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Total Produits</p>
                      <p className="text-3xl font-bold text-white">{stats.totalProducts.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-blue-600/20 rounded-full">
                      <Package className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">+12% ce mois</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-600/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-200 text-sm font-medium">Stock Faible</p>
                      <p className="text-3xl font-bold text-white">{stats.lowStockProducts}</p>
                    </div>
                    <div className="p-3 bg-yellow-600/20 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-red-400 text-sm">-3 cette semaine</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-600/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-200 text-sm font-medium">Ruptures</p>
                      <p className="text-3xl font-bold text-white">{stats.outOfStockProducts}</p>
                    </div>
                    <div className="p-3 bg-red-600/20 rounded-full">
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-red-400 text-sm">+2 cette semaine</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-600/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm font-medium">Valeur Stock</p>
                      <p className="text-3xl font-bold text-white">{(stats.totalStockValue / 1000000).toFixed(1)}M€</p>
                    </div>
                    <div className="p-3 bg-green-600/20 rounded-full">
                      <Euro className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">+8% ce mois</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation des onglets */}
          <div className="mb-6">
            <nav className="flex space-x-8 border-b border-gray-800">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                { id: 'products', label: 'Produits', icon: Package },
                { id: 'analytics', label: 'Analytiques', icon: PieChart },
                { id: 'movements', label: 'Mouvements', icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-400'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top ventes */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Top Ventes du Mois
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.topSelling.map((item, index) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                          <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{item.productName}</h4>
                            <p className="text-gray-400 text-sm">{item.brand} • {item.sales} ventes</p>
                          </div>
                                  <div className="text-right">
                                    <p className="text-white font-semibold">{Number(item.revenue).toLocaleString()} €</p>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-yellow-400 text-sm">#{index + 1}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions rapides */}
              <div>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => router.push('/admin/products/new')} 
                      className="w-full bg-orange-600 hover:bg-orange-700 justify-start"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau produit
                    </Button>
                    <Button 
                      onClick={() => router.push('/admin/products')} 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Gestion produits
                    </Button>
                    <Button 
                      onClick={() => router.push('/admin/stock')} 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Gestion stock
                    </Button>
                    <Button 
                      onClick={() => router.push('/admin/stock/settings')} 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Paramètres stock
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                      onClick={() => router.push('/admin/users')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Gestion utilisateurs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              {/* Filtres et recherche */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  title="Filtrer par statut de stock"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="in-stock">En stock</option>
                  <option value="low-stock">Stock faible</option>
                  <option value="out-of-stock">Rupture</option>
                </select>
              </div>

              {/* Tableau des produits */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800 border-b border-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-gray-300 font-medium">Produit</th>
                          <th className="px-6 py-4 text-left text-gray-300 font-medium">Stock</th>
                          <th className="px-6 py-4 text-left text-gray-300 font-medium">Prix</th>
                          <th className="px-6 py-4 text-left text-gray-300 font-medium">Ventes</th>
                          <th className="px-6 py-4 text-left text-gray-300 font-medium">Statut</th>
                          <th className="px-6 py-4 text-left text-gray-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="w-full h-full object-contain p-1"
                                  />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{item.productName}</p>
                                  <p className="text-gray-400 text-sm">{item.brand} • {item.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-white font-medium">{item.currentStock}</p>
                                <p className="text-gray-400 text-sm">Min: {item.minStock}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-white font-medium">{Number(item.price).toFixed(2)} €</p>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-white font-medium">{item.sales}</p>
                                <p className="text-gray-400 text-sm">{Number(item.revenue).toLocaleString()} €</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-gray-400 hover:text-white"
                                  onClick={() => handleViewProduct(item.id)}
                                  title="Voir le produit"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-gray-400 hover:text-blue-400"
                                  onClick={() => handleEditProduct(item.id)}
                                  title="Modifier le produit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-gray-400 hover:text-red-400"
                                  onClick={() => handleDeleteProduct(item.id)}
                                  title="Supprimer le produit"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Ventes par Catégorie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Sneakers</p>
                        <p className="text-gray-400 text-sm">45% des ventes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">2,847 €</p>
                        <p className="text-green-400 text-sm">+12%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Running</p>
                        <p className="text-gray-400 text-sm">32% des ventes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">1,923 €</p>
                        <p className="text-green-400 text-sm">+8%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Basketball</p>
                        <p className="text-gray-400 text-sm">23% des ventes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">1,456 €</p>
                        <p className="text-red-400 text-sm">-3%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Performance des Marques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">N</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Nike</p>
                          <p className="text-gray-400 text-sm">1,247 produits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">4,234 €</p>
                        <p className="text-green-400 text-sm">+15%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Adidas</p>
                          <p className="text-gray-400 text-sm">892 produits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">2,876 €</p>
                        <p className="text-green-400 text-sm">+9%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Puma</p>
                          <p className="text-gray-400 text-sm">456 produits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">1,234 €</p>
                        <p className="text-red-400 text-sm">-2%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'movements' && (
            <div>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Mouvements de Stock Récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-600/20 rounded-full">
                          <Plus className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Réapprovisionnement</p>
                          <p className="text-gray-400 text-sm">Nike Air Force 1 'Camo'</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">+50 unités</p>
                        <p className="text-gray-400 text-sm">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-600/20 rounded-full">
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Vente</p>
                          <p className="text-gray-400 text-sm">Nike KD 7 'Away'</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">-2 unités</p>
                        <p className="text-gray-400 text-sm">Il y a 4 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-600/20 rounded-full">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Alerte Stock Faible</p>
                          <p className="text-gray-400 text-sm">Nike Air Max Zero Essential</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">5 unités restantes</p>
                        <p className="text-gray-400 text-sm">Il y a 6 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-600/20 rounded-full">
                          <RefreshCw className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Mise à jour automatique</p>
                          <p className="text-gray-400 text-sm">Synchronisation avec l'inventaire</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">247 produits</p>
                        <p className="text-gray-400 text-sm">Il y a 1 jour</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
