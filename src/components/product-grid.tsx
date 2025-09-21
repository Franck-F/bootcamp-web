'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/store/cart-context'
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

interface ProductGridProps {
  products: Product[]
  loading: boolean
  viewMode: 'grid' | 'list'
}

export function ProductGrid({ products, loading, viewMode }: ProductGridProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [favorites, setFavorites] = useState<string[]>([])
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id)
    try {
      const availableVariant = product.variants.find(variant => variant.stock > 0)
      if (availableVariant) {
        addItem({
          productId: product.id.toString(),
          size: availableVariant.size || 'Unique',
          quantity: 1,
          addedAt: new Date().toISOString(),
        })
      }
    } finally {
      setAddingToCart(null)
    }
  }

  const viewProduct = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  const toggleFavorite = (productId: number) => {
    const idString = productId.toString()
    setFavorites(prev => 
      prev.includes(idString) 
        ? prev.filter(id => id !== idString)
        : [...prev, idString]
    )
  }

  const getAvailableSizes = (product: Product) => {
    return product.variants.filter(variant => variant.stock > 0)
  }

  const formatSize = (sizeString: string, category?: string) => {
    if (!sizeString) return 'Unique'
    
    // Pour les enfants, utiliser les normes européennes spécifiques
    if (category === 'Infant/Toddler Shoes' || category?.toLowerCase().includes('enfant')) {
      // Extraire la taille EU (normes européennes pour enfants)
      const euMatch = sizeString.match(/EU (\d+(?:\.\d+)?)/)
      if (euMatch) {
        const euSize = parseFloat(euMatch[1])
        // Tailles enfants EU typiques : 18-35
        if (euSize >= 18 && euSize <= 35) {
          return `EU ${euSize}`
        }
      }
      
      // Si pas de EU, essayer US et convertir
      const usMatch = sizeString.match(/US (\d+(?:\.\d+)?)/)
      if (usMatch) {
        const usSize = parseFloat(usMatch[1])
        // Conversion approximative US vers EU pour enfants
        const euSize = Math.round(usSize + 18)
        if (euSize >= 18 && euSize <= 35) {
          return `EU ${euSize}`
        }
      }
    }
    
    // Pour les adultes, priorité EU puis US
    const euMatch = sizeString.match(/EU (\d+(?:\.\d+)?)/)
    if (euMatch) {
      return `EU ${euMatch[1]}`
    }
    
    // Si pas de EU, essayer US
    const usMatch = sizeString.match(/US (\d+(?:\.\d+)?)/)
    if (usMatch) {
      return `US ${usMatch[1]}`
    }
    
    // Si rien ne correspond, retourner les 10 premiers caractères
    return sizeString.length > 10 ? sizeString.substring(0, 10) + '...' : sizeString
  }

  if (loading) {
    return (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
        <p className="text-gray-600 mb-4">
          Essayez de modifier vos critères de recherche ou de filtres.
        </p>
        <Button onClick={() => window.location.reload()}>
          Voir tous les produits
        </Button>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => {
          const availableSizes = getAvailableSizes(product)
          const isInStock = availableSizes.length > 0
          const isFavorite = favorites.includes(product.id.toString())

          return (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="flex">
                <div className="w-48 h-48 relative flex-shrink-0 bg-white rounded-l-lg overflow-hidden">
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={product.product_images[0]?.image_url || '/images/placeholder-sneaker.jpg'}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.categories.name}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="product-brand">{product.brands.name}</p>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="product-title hover:text-blue-600 transition-colors mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.averageRating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-readable-muted ml-2">
                          ({product.totalReviews})
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="product-price text-2xl mb-4">
                        {formatPrice(product.price)}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFavorite(product.id)}
                          className={isFavorite ? 'text-red-500' : 'text-gray-400'}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => viewProduct(product.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={!isInStock || addingToCart === product.id}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>

                  {availableSizes.length > 0 && (
                    <div>
                      <p className="text-sm text-readable-light mb-2">Tailles disponibles:</p>
                      <div className="flex flex-wrap gap-1">
                        {availableSizes.slice(0, 6).map((variant) => (
                          <Badge 
                            key={variant.id} 
                            variant="outline" 
                            className="product-size text-xs px-2 py-1 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            {formatSize(variant.size || '', product.categories?.name)}
                          </Badge>
                        ))}
                        {availableSizes.length > 6 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700"
                          >
                            +{availableSizes.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const availableSizes = getAvailableSizes(product)
        const isInStock = availableSizes.length > 0
        const isFavorite = favorites.includes(product.id.toString())

        return (
          <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative overflow-hidden">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square relative bg-white">
                  <Image
                    src={product.product_images[0]?.image_url || '/images/placeholder-sneaker.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                  />
                  {!isInStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-sm">
                        Rupture de stock
                      </Badge>
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {product.categories.name}
                </Badge>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-2">
                <p className="product-brand">{product.brands.name}</p>
                <Link href={`/products/${product.id}`}>
                  <h3 className="product-title hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
              </div>

              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-readable-muted ml-2">
                  ({product.totalReviews})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="product-price text-lg">
                  {formatPrice(product.price)}
                </span>
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={() => viewProduct(product.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleAddToCart(product)}
                    disabled={!isInStock}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {availableSizes.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Tailles disponibles:</p>
                  <div className="flex flex-wrap gap-1">
                    {availableSizes.slice(0, 3).map((variant) => (
                      <Badge 
                        key={variant.id} 
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-700"
                      >
                        {formatSize(variant.size || '', product.categories?.name)}
                      </Badge>
                    ))}
                    {availableSizes.length > 3 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700"
                      >
                        +{availableSizes.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
