'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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

interface FeaturedProduct {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviews: number
  stock: number
  image: string
  isNew?: boolean
  colors: string[]
}

export function FeaturedProductsNew() {
  const router = useRouter()
  const [products] = useState<FeaturedProduct[]>([
    {
      id: 1,
      name: 'Nike Air Force 1 \'Camo\'',
      brand: 'Nike',
      price: 405,
      originalPrice: 450,
      discount: 10,
      rating: 4.8,
      reviews: 1247,
      stock: 24,
      image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/products/main-square_107628ca-8acc-4f95-9a58-1922e8c31518.jpg?v=1695974200',
      colors: ['#000000', '#808080']
    },
    {
      id: 2,
      name: 'Nike KD 7 \'Away\'',
      brand: 'Nike',
      price: 267,
      rating: 4.8,
      reviews: 892,
      stock: 17,
      image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_b99b60e1-ebf9-48f9-98d9-e484f6ce4501.jpg?v=1708490285',
      isNew: true,
      colors: ['#000000', '#FFFFFF']
    },
    {
      id: 3,
      name: 'Nike Air Max Zero Essential \'Black Grey\'',
      brand: 'Nike',
      price: 215,
      originalPrice: 250,
      discount: 14,
      rating: 4.8,
      reviews: 634,
      stock: 27,
      image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/products/main-square_44fd6ba6-e129-40e0-af82-75e6b891fbc3.jpg?v=1656836081',
      isNew: true,
      colors: ['#000000', '#808080']
    }
  ])

  const [favorites, setFavorites] = useState<number[]>([])
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = async (product: FeaturedProduct) => {
    setAddingToCart(product.id)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          variantId: null // Utiliser la première variante disponible
        }),
      })

      if (response.ok) {
        // Optionnel: Afficher une notification de succès
        console.log('Produit ajouté au panier')
      } else {
        console.error('Erreur lors de l\'ajout au panier')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  const viewProduct = (productId: number) => {
    router.push(`/products/${productId}`)
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
          {products.map((product, index) => {
            const isFavorite = favorites.includes(product.id)
            const isInStock = product.stock > 0

            return (
              <Card key={product.id} className="group bg-gray-800/30 border border-gray-700/50 text-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 backdrop-blur-sm">
                <div className="relative h-80 w-full overflow-hidden bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Enhanced Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.discount && (
                      <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs px-3 py-1 font-bold shadow-lg">
                        -{product.discount}% OFF
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs px-3 py-1 font-bold shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Nouveau
                      </Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-10 h-10 bg-black/50 backdrop-blur-sm border border-gray-600 hover:bg-red-600 hover:border-red-600"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} />
                    </Button>
                  </div>

                  {/* Stock Indicator */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-green-600/90 text-white text-xs px-2 py-1">
                      {product.stock} en stock
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="space-y-4">
                    {/* Brand & Rating */}
                    <div className="flex justify-between items-center">
                      <Badge className="bg-gray-700/50 text-gray-300 border-gray-600">
                        {product.brand}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-400 font-medium">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="product-title text-xl text-white hover:text-red-400 transition-colors line-clamp-2">
                      <Link href={`/products/${product.id}`}>{product.name}</Link>
                    </h3>

                    {/* Price */}
                    <div className="flex items-center space-x-3">
                      <span className="product-price text-3xl text-white">
                        {product.price.toFixed(2)}€
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {product.originalPrice.toFixed(2)}€
                        </span>
                      )}
                    </div>

                    {/* Color Options */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Couleurs:</span>
                      {product.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-6 h-6 rounded-full border-2 border-gray-600 hover:border-white transition-colors cursor-pointer"
                          style={{ backgroundColor: color }}
                          title={color}
                        ></div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 bg-gray-700/50 text-white border-gray-600 hover:bg-gray-600 hover:border-gray-500 rounded-xl"
                        onClick={() => viewProduct(product.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                        onClick={() => addToCart(product)}
                        disabled={addingToCart === product.id}
                      >
                        {addingToCart === product.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        {addingToCart === product.id ? 'Ajout...' : 'Ajouter'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
