'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { ProductGrid } from '@/components/product-grid'
import { ProductFilters } from '@/components/product-filters'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  SlidersHorizontal,
  Grid,
  List,
  Search,
  Filter,
  X,
  Crown,
  Sparkles,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  sku?: string
  featured: boolean
  isNew: boolean
  onSale: boolean
  originalPrice?: number
  is_active: boolean
  created_at: string
  averageRating: number
  totalReviews: number
  brands: {
    id: number
    name: string
  }
  categories: {
    id: number
    name: string
  }
  variants: Array<{
    id: number
    size?: string
    color?: string
    price: number
    stock: number
  }>
  product_images: Array<{
    id: number
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

export default function NouveautesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    brand: '',
    new: true, // Filtre pour les nouveautés
  })

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.new) params.append('new', 'true')
      params.append('limit', '24')

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters })
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      brand: '',
      new: true,
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.search) count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++
    if (filters.brand) count++
    return count
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3 mb-8">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-white">Nouveautés</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Les{' '}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Nouveautés
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Chargement des dernières nouveautés...</span>
                </span>
              ) : (
                <>
                  Découvrez en avant-première{' '}
                  <span className="text-white font-medium">{products.length} nouvelles sneakers</span>
                  {' '}de notre collection premium.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden border-gray-700 text-white hover:bg-gray-800"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtres
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-700 rounded-xl bg-gray-900/50 backdrop-blur-sm">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="lg"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-r-none ${viewMode === 'grid' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="lg"
                  onClick={() => setViewMode('list')}
                  className={`rounded-l-none ${viewMode === 'list' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap gap-3">
                {filters.category && (
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30 px-3 py-1 flex items-center gap-2">
                    <span>Catégorie: {filters.category}</span>
                        <button
                          onClick={() => handleFilterChange({ category: '' })}
                          className="hover:text-green-300 transition-colors"
                          title="Supprimer le filtre de catégorie"
                        >
                          <X className="w-3 h-3" />
                        </button>
                  </Badge>
                )}
                {filters.search && (
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-3 py-1 flex items-center gap-2">
                    <span>Recherche: {filters.search}</span>
                        <button
                          onClick={() => handleFilterChange({ search: '' })}
                          className="hover:text-blue-300 transition-colors"
                          title="Supprimer le filtre de recherche"
                        >
                          <X className="w-3 h-3" />
                        </button>
                  </Badge>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30 px-3 py-1 flex items-center gap-2">
                    <span>Prix: {filters.minPrice || '0'}€ - {filters.maxPrice || '∞'}€</span>
                        <button
                          onClick={() => handleFilterChange({ minPrice: '', maxPrice: '' })}
                          className="hover:text-green-300 transition-colors"
                          title="Supprimer le filtre de prix"
                        >
                          <X className="w-3 h-3" />
                        </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white"
                >
                  Effacer tout
                </Button>
              </div>
            )}
          </div>

          {/* Filtres horizontaux */}
          <div className="mb-12">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Contenu principal */}
          <div className="w-full">
            <ProductGrid
              products={products}
              loading={loading}
              viewMode={viewMode}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
