'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  Edit,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface StockVariant {
  id: number
  productName: string
  brand: string
  category: string
  size: string
  color: string
  stock: number
  price: number
  sku: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

interface StockSummary {
  totalVariants: number
  lowStockVariants: number
  outOfStockVariants: number
  inStockVariants: number
  lowStockPercentage: string
  outOfStockPercentage: string
}

export default function AdminStockPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [variants, setVariants] = useState<StockVariant[]>([])
  const [summary, setSummary] = useState<StockSummary | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editingStock, setEditingStock] = useState<{ [key: number]: number }>({})
  const [bulkUpdates, setBulkUpdates] = useState<Array<{ variantId: number; stock: number }>>([])

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    fetchStockData()
  }, [user, loading, router])

  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/admin/stock/refresh')
      if (response.ok) {
        const data = await response.json()
        setVariants(data.variants || [])
        setSummary(data.summary || null)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du stock:', error)
      toast.error('Erreur lors du chargement du stock')
    } finally {
      setPageLoading(false)
    }
  }

  const handleStockEdit = (variantId: number, currentStock: number) => {
    setEditingStock(prev => ({
      ...prev,
      [variantId]: currentStock
    }))
  }

  const handleStockSave = async (variantId: number) => {
    const newStock = editingStock[variantId]
    if (newStock === undefined) return

    try {
      const response = await fetch('/api/admin/stock/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
          newStock
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Stock mis à jour avec succès')
        setEditingStock(prev => {
          const newState = { ...prev }
          delete newState[variantId]
          return newState
        })
        fetchStockData()
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleBulkUpdate = async () => {
    if (bulkUpdates.length === 0) {
      toast.error('Aucune mise à jour en attente')
      return
    }

    try {
      const response = await fetch('/api/admin/stock/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'bulk',
          updates: bulkUpdates
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Mise à jour en masse terminée: ${result.results.length} variantes`)
        setBulkUpdates([])
        fetchStockData()
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour en masse')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour en masse:', error)
      toast.error('Erreur lors de la mise à jour en masse')
    }
  }

  const addToBulkUpdate = (variantId: number, stock: number) => {
    setBulkUpdates(prev => {
      const existing = prev.find(update => update.variantId === variantId)
      if (existing) {
        return prev.map(update => 
          update.variantId === variantId ? { ...update, stock } : update
        )
      } else {
        return [...prev, { variantId, stock }]
      }
    })
  }

  const removeFromBulkUpdate = (variantId: number) => {
    setBulkUpdates(prev => prev.filter(update => update.variantId !== variantId))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'low-stock':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'out-of-stock':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Package className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-500'
      case 'low-stock':
        return 'bg-yellow-500'
      case 'out-of-stock':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const filteredVariants = variants.filter(variant => {
    const matchesSearch = variant.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         variant.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || variant.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement du stock...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestion du Stock</h1>
            <p className="text-gray-400">Surveillez et gérez les niveaux de stock</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={fetchStockData}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button
              onClick={() => router.push('/admin/stock/settings')}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Résumé du stock */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Variantes</p>
                    <p className="text-2xl font-bold text-white">{summary.totalVariants}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">En Stock</p>
                    <p className="text-2xl font-bold text-green-500">{summary.inStockVariants}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Stock Faible</p>
                    <p className="text-2xl font-bold text-yellow-500">{summary.lowStockVariants}</p>
                    <p className="text-xs text-gray-400">{summary.lowStockPercentage}%</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Rupture</p>
                    <p className="text-2xl font-bold text-red-500">{summary.outOfStockVariants}</p>
                    <p className="text-xs text-gray-400">{summary.outOfStockPercentage}%</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mise à jour en masse */}
        {bulkUpdates.length > 0 && (
          <Card className="bg-orange-900 border-orange-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className="text-white font-medium">
                    {bulkUpdates.length} mise(s) à jour en attente
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleBulkUpdate}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Appliquer
                  </Button>
                  <Button
                    onClick={() => setBulkUpdates([])}
                    size="sm"
                    variant="outline"
                    className="border-orange-600 text-orange-500 hover:bg-orange-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtres */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="in-stock">En stock</option>
                  <option value="low-stock">Stock faible</option>
                  <option value="out-of-stock">Rupture</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des variantes */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Variantes ({filteredVariants.length})</span>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                {variants.length} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVariants.map((variant) => {
                const isEditing = editingStock[variant.id] !== undefined
                const isInBulkUpdate = bulkUpdates.some(update => update.variantId === variant.id)
                
                return (
                  <div
                    key={variant.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      isInBulkUpdate 
                        ? 'bg-orange-900 border-orange-800' 
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(variant.status)}
                        <h3 className="text-white font-semibold">{variant.productName}</h3>
                        <Badge className={`${getStatusColor(variant.status)} text-white text-xs`}>
                          {variant.status === 'in-stock' ? 'En stock' : 
                           variant.status === 'low-stock' ? 'Stock faible' : 'Rupture'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{variant.brand}</span>
                        <span>•</span>
                        <span>{variant.category}</span>
                        <span>•</span>
                        <span>Taille: {variant.size}</span>
                        <span>•</span>
                        <span>Couleur: {variant.color}</span>
                        <span>•</span>
                        <span>SKU: {variant.sku}</span>
                        <span>•</span>
                        <span>{variant.price.toFixed(2)} €</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editingStock[variant.id]}
                            onChange={(e) => setEditingStock(prev => ({
                              ...prev,
                              [variant.id]: parseInt(e.target.value) || 0
                            }))}
                            className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                            min="0"
                          />
                          <Button
                            onClick={() => handleStockSave(variant.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setEditingStock(prev => {
                              const newState = { ...prev }
                              delete newState[variant.id]
                              return newState
                            })}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium min-w-[3rem] text-center">
                            {variant.stock}
                          </span>
                          <Button
                            onClick={() => handleStockEdit(variant.id, variant.stock)}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => addToBulkUpdate(variant.id, variant.stock)}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-orange-500"
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {filteredVariants.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucune variante trouvée</h3>
                  <p className="text-gray-400">Aucune variante ne correspond à vos critères de recherche.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
