'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/store/cart-context'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  images: string[]
  category: string
  averageRating: number
  totalReviews: number
  stockItems: Array<{
    size: string
    quantity: number
    reserved: number
  }>
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=8')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    // Pour simplifier, on ajoute la première taille disponible
    const availableSize = product.stockItems.find(item => item.quantity > item.reserved)
    if (availableSize) {
      addItem({
        productId: product.id,
        size: availableSize.size,
        quantity: 1,
        addedAt: new Date().toISOString(),
      })
    }
  }

  const getAvailableSizes = (product: Product) => {
    return product.stockItems.filter(item => item.quantity > item.reserved)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produits vedettes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produits vedettes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos meilleures ventes et nouveautés
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const availableSizes = getAvailableSizes(product)
            const isInStock = availableSizes.length > 0
            
            return (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-square relative">
                      <Image
                        src={product.images[0] || '/images/placeholder-sneaker.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      {product.category}
                    </Badge>
                  </div>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 font-medium">{product.brand}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
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
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.totalReviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
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
                        {availableSizes.slice(0, 4).map((item) => (
                          <Badge key={item.size} variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                        ))}
                        {availableSizes.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{availableSizes.length - 4}
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

        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" className="text-lg px-8 py-4">
              Voir tous les produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
