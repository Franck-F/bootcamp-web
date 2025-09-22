'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/store/cart-context'
import { WishlistButton } from '@/components/wishlist-button'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye, 
  ArrowRight, 
  Crown,
  Sparkles,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  discount?: number
  rating?: number
  reviews?: number
  stock: number
  images: string[]
  isNew?: boolean
  featured?: boolean
  onSale?: boolean
  brand: { name: string }
  category: { name: string }
  variants: Array<{
    id: number
    size?: string
    color?: string
    stock: number
  }>
}

export function FeaturedProductsNew() {
  const router = useRouter()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=3')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        } else {
          console.error('Erreur lors du chargement des produits depuis la base de données')
          setProducts([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits depuis la base de données:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const addToCart = async (product: Product) => {
    setAddingToCart(product.id)
    try {
      const availableVariant = product.variants.find(variant => variant.stock > 0)
      if (availableVariant) {
        await addItem({
          productId: product.id.toString(),
          size: availableVariant.size || 'Unique',
          quantity: 1,
          addedAt: new Date().toISOString(),
          product: {
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            images: product.images,
            brand: product.brand?.name || 'Marque inconnue',
            category: product.category?.name || 'Catégorie inconnue',
            availableStock: availableVariant.stock,
          }
        })
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((total, variant) => total + variant.stock, 0)
  }

  const isInStock = (product: Product) => {
    return getTotalStock(product) > 0
  }

  return (
    <section id="featured-products" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-3 mb-8">
            <Crown className="w-5 h-5 text-red-400" />
            <span className="text-sm font-semibold text-white">Sélection Premium</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Nos{' '}
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              coups de cœur
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Découvrez notre sélection exclusive des sneakers les plus 
            <span className="text-white font-medium"> convoitées et mieux notées</span> du moment.
          </p>
        </div>

        {/* Enhanced Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="group bg-gray-800/30 border border-gray-700/50 text-white rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="relative h-80 w-full overflow-hidden bg-gray-700 animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-gray-600 border-t-red-500 rounded-full animate-spin"></div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : products.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-xl">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            products.map((product, index) => {
              const totalStock = getTotalStock(product)
              const stockAvailable = isInStock(product)

              return (
                <Card key={product.id} className="group bg-gray-800/30 border border-gray-700/50 text-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 backdrop-blur-sm">
                  <div className="relative h-80 w-full overflow-hidden bg-white">
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-sneaker.jpg'}
                      alt={product.name}
                      fill
                      className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-sneaker.jpg';
                      }}
                    />
                  
                  {/* Enhanced Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.onSale && product.originalPrice && (
                      <Badge className="bg-red-600/90 text-white text-xs px-3 py-1 font-bold">
                        -{Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}%
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-green-600/90 text-white text-xs px-3 py-1 font-bold">
                        Nouveau
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <WishlistButton
                      productId={product.id}
                      size="icon"
                      variant="secondary"
                      className="w-10 h-10 bg-black/50 backdrop-blur-sm border border-gray-600 hover:bg-red-600 hover:border-red-600"
                    />
                  </div>

                  {/* Stock Indicator */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className={`${stockAvailable ? 'bg-green-600/90' : 'bg-red-600/90'} text-white text-xs px-2 py-1`}>
                      {stockAvailable ? `${totalStock} en stock` : 'Rupture de stock'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="space-y-4">
                    {/* Brand & Rating */}
                    <div className="flex justify-between items-center">
                      <Badge className="bg-gray-700/50 text-gray-300 border-gray-600">
                        {product.brand?.name || 'Marque inconnue'}
                      </Badge>
                      {product.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-400 font-medium">
                            {product.rating} ({product.reviews || 0})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="product-title text-xl text-white hover:text-red-400 transition-colors line-clamp-2">
                      <Link href={`/products/${product.id}`}>{product.name}</Link>
                    </h3>

                    {/* Price */}
                    <div className="flex items-center space-x-3">
                      <span className="product-price text-3xl text-white">
                        {Number(product.price).toFixed(2)}€
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {Number(product.originalPrice).toFixed(2)}€
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 bg-gray-700/50 text-white border-gray-600 hover:bg-gray-600 hover:border-gray-500 rounded-xl"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                        onClick={() => addToCart(product)}
                        disabled={addingToCart === product.id || !stockAvailable}
                      >
                        {addingToCart === product.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        {addingToCart === product.id ? 'Ajout...' : !stockAvailable ? 'Rupture' : 'Ajouter'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
          )}
        </div>

        {/* Enhanced CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col items-center space-y-6">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105">
              <TrendingUp className="w-6 h-6 mr-3" />
              Voir toute la collection
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            
            <div className="flex items-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Qualité garantie</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Livraison rapide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm">Satisfaction client</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
