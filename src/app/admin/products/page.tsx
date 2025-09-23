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
  Plus,
  Upload,
  Download,
  RefreshCw,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  price: number
  sku: string
  featured: boolean
  isNew: boolean
  onSale: boolean
  is_active: boolean
  brands: {
    name: string
  }
  categories: {
    name: string
  }
  variants: Array<{
    id: number
    size: string
    color: string
    stock: number
  }>
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.role !== 'admin') {
      router.push('/')
      return
    }

    fetchProducts()
  }, [session, status, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=100')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Veuillez sélectionner un fichier')
      return
    }

    setIsImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', importFile)

      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Import terminé: ${result.results.imported} nouveaux, ${result.results.updated} mis à jour`)
        fetchProducts()
        setImportFile(null)
      } else {
        toast.error(result.error || 'Erreur lors de l\'import')
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
      toast.error('Erreur lors de l\'import')
    } finally {
      setIsImporting(false)
    }
  }

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/admin/products/export?format=${format}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `products-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Export terminé')
      } else {
        toast.error('Erreur lors de l\'export')
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      toast.error('Erreur lors de l\'export')
    }
  }

  const getStockStatus = (variants: Product['variants']) => {
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
    if (totalStock === 0) return { status: 'out-of-stock', label: 'Rupture', color: 'bg-red-500' }
    if (totalStock <= 10) return { status: 'low-stock', label: 'Stock faible', color: 'bg-yellow-500' }
    return { status: 'in-stock', label: 'En stock', color: 'bg-green-500' }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categories.name === selectedCategory
    const matchesBrand = !selectedBrand || product.brands.name === selectedBrand
    
    return matchesSearch && matchesCategory && matchesBrand
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement des produits...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestion des Produits</h1>
            <p className="text-gray-400">Gérez votre catalogue de produits</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/admin/products/new')}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Produit
            </Button>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-500" />
                Import Produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                />
                <Button
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Importer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">
                <Download className="w-5 h-5 mr-2 text-green-500" />
                Export Produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => handleExport('json')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  onClick={() => handleExport('csv')}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-500" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={fetchProducts}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
                <Button
                  onClick={() => router.push('/admin/stock')}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Gestion Stock
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Toutes les catégories</option>
                  <option value="Sneakers">Sneakers</option>
                  <option value="Marathon Running Shoes/Sneakers">Marathon Running Shoes</option>
                  <option value="Infant/Toddler Shoes">Chaussures Enfant</option>
                </select>
                
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Toutes les marques</option>
                  <option value="Nike">Nike</option>
                  <option value="Adidas">Adidas</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Puma">Puma</option>
                  <option value="New Balance">New Balance</option>
                  <option value="Converse">Converse</option>
                  <option value="Vans">Vans</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des produits */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Produits ({filteredProducts.length})</span>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                {products.length} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.variants)
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-semibold">{product.name}</h3>
                        <Badge className={`${stockStatus.color} text-white text-xs`}>
                          {stockStatus.label}
                        </Badge>
                        {product.featured && (
                          <Badge className="bg-purple-600 text-white text-xs">Featured</Badge>
                        )}
                        {product.isNew && (
                          <Badge className="bg-green-600 text-white text-xs">Nouveau</Badge>
                        )}
                        {product.onSale && (
                          <Badge className="bg-red-600 text-white text-xs">Solde</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{product.brands.name}</span>
                        <span>•</span>
                        <span>{product.categories.name}</span>
                        <span>•</span>
                        <span>SKU: {product.sku}</span>
                        <span>•</span>
                        <span>{product.price.toFixed(2)} €</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-400 mb-6">Aucun produit ne correspond à vos critères de recherche.</p>
                  <Button
                    onClick={() => router.push('/admin/products/new')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un produit
                  </Button>
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
