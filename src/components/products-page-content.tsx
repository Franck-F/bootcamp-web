'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductGrid } from '@/components/product-grid'
import { ProductFilters } from '@/components/product-filters'
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
  Star
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
    sku?: string
  }>
  product_images: Array<{
    id: number
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

export function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: 'newest',
    brand: searchParams.get('brand') || ''
  })

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async (page = 1, append = false) => {
    if (page === 1) {
      setLoading(true)
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
      params.append('page', page.toString())

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      if (append) {
        setProducts(prev => [...prev, ...(data.products || [])])
      } else {
        setProducts(data.products || [])
        setCurrentPage(1)
      }
      
      setHasMore(data.pagination?.hasMore || false)
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

  const loadMoreProducts = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchProducts(nextPage, true)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      brand: ''
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
      {/* Header avec filtres */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Titre et description */}
            <div className="flex-1">
              <h1 className="text-4xl font-black text-white mb-2 flex items-center">
                <Crown className="w-8 h-8 mr-3 text-orange-500" />
                Tous les Produits
              </h1>
              <p className="text-gray-400 text-lg">
                Découvrez notre collection complète de sneakers premium
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Bouton filtres mobile */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtres
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>

              {/* Mode d'affichage */}
              <div className="flex items-center border border-gray-600 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filtres actifs */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">Filtres actifs:</span>
              {filters.category && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Catégorie: {filters.category}
                  <button
                    onClick={() => handleFilterChange({ category: '' })}
                    className="ml-2 hover:text-orange-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.brand && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Marque: {filters.brand}
                  <button
                    onClick={() => handleFilterChange({ brand: '' })}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.search && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Recherche: {filters.search}
                  <button
                    onClick={() => handleFilterChange({ search: '' })}
                    className="ml-2 hover:text-green-600"
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar des filtres */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Résultats */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  {loading ? 'Chargement...' : `${products.length} produit${products.length > 1 ? 's' : ''} trouvé${products.length > 1 ? 's' : ''}`}
                </p>
                
                {!loading && products.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Marques prioritaires en premier</span>
                  </div>
                )}
              </div>
            </div>

            {/* Grille des produits */}
            <ProductGrid 
              products={products} 
              loading={loading} 
              viewMode={viewMode} 
            />

            {/* Bouton "Charger plus" */}
            {hasMore && !loading && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMoreProducts}
                  disabled={loadingMore}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Charger plus de produits
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Message si aucun produit */}
            {!loading && products.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-400 mb-6">
                  Essayez de modifier vos filtres ou de rechercher autre chose.
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
