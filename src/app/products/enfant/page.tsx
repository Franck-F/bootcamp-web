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
  Baby
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
  images: string[]
}

export default function EnfantPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'Infant/Toddler Shoes',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    brand: ''
  })

  useEffect(() => {
    fetchProducts(true)
  }, [filters])

  const fetchProducts = async (reset = false) => {
    if (reset) {
      setLoading(true)
      setCurrentPage(1)
    } else {
      setLoadingMore(true)
    }

    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.brand) params.append('brand', filters.brand)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      params.append('limit', '24')
      params.append('page', reset ? '1' : currentPage.toString())

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      if (reset) {
        setProducts(data.products || [])
      } else {
        setProducts(prev => [...prev, ...(data.products || [])])
      }
      setHasMore((data.products || []).length === 24)
      if (!reset) {
        setCurrentPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters })
  }

  const clearFilters = () => {
    setFilters({
      category: 'Infant/Toddler Shoes',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      brand: ''
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++
    if (filters.brand) count++
    return count
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-3 mb-8">
              <Baby className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Chaussures Enfant</span>
              <Sparkles className="w-4 h-4 text-orange-400" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Collection{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Enfant
              </span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Chargement de notre collection enfant...</span>
                </span>
              ) : (
                <>
                  Découvrez notre sélection de{' '}
                  <span className="text-white font-medium">{products.length} sneakers premium</span>
                  {' '}pour enfants, colorées et résistantes.
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
                  className={`rounded-r-none ${viewMode === 'grid' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="lg"
                  onClick={() => setViewMode('list')}
                  className={`rounded-l-none ${viewMode === 'list' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap gap-3">
                {filters.search && (
                  <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 px-3 py-1 flex items-center gap-2">
                    <span>Recherche: {filters.search}</span>
                        <button
                          onClick={() => handleFilterChange({ search: '' })}
                          className="hover:text-yellow-300 transition-colors"
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
            
            {/* Bouton Charger plus */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Chargement...
                    </>
                  ) : (
                    'Charger plus de produits'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
