'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Plus,
  Minus,
  Check,
  Heart,
  Share2,
  ZoomIn,
  Crown,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react'
import { WishlistButton } from '@/components/wishlist-button'
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
    sku?: string
  }>
  product_images: Array<{
    id: number
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
          setSelectedSize(data.variants[0].size || '')
          setSelectedColor(data.variants[0].color || '')
        }
      } else {
        router.push('/products')
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error)
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (size: string) => {
    if (!size) return ''
    
    // Si c'est déjà une taille EU, la retourner
    if (size.includes('EU') || size.includes('FR')) {
      return size
    }
    
    // Conversion US vers EU pour adultes
    const usToEuAdult: { [key: string]: string } = {
      '6': 'EU 39', '6.5': 'EU 39.5', '7': 'EU 40', '7.5': 'EU 40.5',
      '8': 'EU 41', '8.5': 'EU 42', '9': 'EU 42.5', '9.5': 'EU 43',
      '10': 'EU 44', '10.5': 'EU 44.5', '11': 'EU 45', '11.5': 'EU 45.5',
      '12': 'EU 46', '12.5': 'EU 47', '13': 'EU 47.5', '14': 'EU 48.5'
    }
    
    // Conversion US vers EU pour enfants
    const usToEuChild: { [key: string]: string } = {
      '1': 'EU 32', '1.5': 'EU 33', '2': 'EU 33.5', '2.5': 'EU 34',
      '3': 'EU 35', '3.5': 'EU 35.5', '4': 'EU 36', '4.5': 'EU 37',
      '5': 'EU 37.5', '5.5': 'EU 38'
    }
    
    // Essayer d'abord la conversion adulte
    if (usToEuAdult[size]) {
      return usToEuAdult[size]
    }
    
    // Puis la conversion enfant
    if (usToEuChild[size]) {
      return usToEuChild[size]
    }
    
    // Si aucune correspondance, retourner la taille originale
    return size
  }

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
    setSelectedSize(variant.size || '')
    setSelectedColor(variant.color || '')
  }

  const handleAddToCart = () => {
    if (selectedVariant && product) {
      addItem({
        productId: product.id.toString(),
        size: selectedVariant.size || '',
        quantity: quantity,
        addedAt: new Date().toISOString(),
        product: {
          id: product.id.toString(),
          name: product.name,
          brand: product.brands.name,
          price: selectedVariant.price,
          images: product.product_images.map(img => img.image_url),
          availableStock: selectedVariant.stock,
          category: product.categories.name
        }
      })
    }
  }

  const getAvailableSizes = () => {
    if (!product?.variants) return []
    const sizes = Array.from(new Set(product.variants.map(v => v.size).filter((size): size is string => Boolean(size))))
    return sizes.sort()
  }

  const getAvailableColors = () => {
    if (!product?.variants) return []
    const colors = Array.from(new Set(product.variants.map(v => v.color).filter((color): color is string => Boolean(color))))
    return colors
  }

  const getVariantsBySize = (size: string) => {
    return product?.variants.filter(v => v.size === size) || []
  }

  const getVariantsByColor = (color: string) => {
    return product?.variants.filter(v => v.color === color) || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement du produit...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Produit non trouvé</h3>
            <p className="text-gray-400 mb-6">Le produit que vous recherchez n'existe pas.</p>
            <Link href="/products">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Retour aux produits
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Header avec design cohérent */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="text-gray-600">/</span>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Produits
                </Link>
                <span className="text-gray-600">/</span>
                <Link href={`/products?category=${product.categories.name}`} className="text-gray-400 hover:text-white transition-colors">
                  {product.categories.name}
                </Link>
              </div>
              <h1 className="text-4xl font-black text-white mb-2 flex items-center">
                <Crown className="w-8 h-8 mr-3 text-orange-500" />
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg">
                {product.brands.name} • {product.categories.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {product.featured && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Nouveau
                </Badge>
              )}
              {product.onSale && (
                <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative group">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden">
                <Image
                  src={product.product_images[selectedImage]?.image_url || '/placeholder-sneaker.jpg'}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-sneaker.jpg'
                  }}
                />
              </div>
            </div>

            {/* Miniatures */}
            {product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.product_images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`aspect-square bg-white rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-orange-500 ring-2 ring-orange-500/20' 
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-sneaker.jpg'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-white font-semibold mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Prix et évaluation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-white">
                    {product.price.toFixed(2)} €
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {product.originalPrice.toFixed(2)} €
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  ({product.totalReviews} avis)
                </span>
              </div>
            </div>

            {/* Sélection des variantes */}
            <div className="space-y-6">
              {/* Tailles */}
              {getAvailableSizes().length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Taille</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {getAvailableSizes().map((size) => {
                      const variants = getVariantsBySize(size)
                      const isAvailable = variants.some(v => v.stock > 0)
                      const isSelected = selectedSize === size
                      
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (isAvailable) {
                              const variant = variants.find(v => v.stock > 0)
                              if (variant) {
                                handleVariantChange(variant)
                              }
                            }
                          }}
                          disabled={!isAvailable}
                          className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                              : isAvailable
                              ? 'border-gray-600 text-white hover:border-gray-500 hover:bg-gray-800'
                              : 'border-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {formatSize(size)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Couleurs */}
              {getAvailableColors().length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Couleur</h3>
                  <div className="flex space-x-3">
                    {getAvailableColors().map((color) => {
                      const variants = getVariantsByColor(color)
                      const isAvailable = variants.some(v => v.stock > 0)
                      const isSelected = selectedColor === color
                      
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            if (isAvailable) {
                              const variant = variants.find(v => v.stock > 0)
                              if (variant) {
                                handleVariantChange(variant)
                              }
                            }
                          }}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                              : isAvailable
                              ? 'border-gray-600 text-white hover:border-gray-500 hover:bg-gray-800'
                              : 'border-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {color}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantité */}
              <div>
                <h3 className="text-white font-semibold mb-3">Quantité</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-600 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-white hover:bg-gray-800"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 text-white font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                      className="text-white hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {selectedVariant && (
                    <span className="text-gray-400 text-sm">
                      {selectedVariant.stock} en stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </Button>
                
                <WishlistButton 
                  productId={product.id}
                  className="px-6 py-4 border border-gray-600 text-white hover:bg-gray-800"
                />
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-3"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>

            {/* Informations de livraison */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-orange-500" />
                  Livraison & Retours
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Livraison gratuite à partir de 50€
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Retours gratuits sous 30 jours
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Garantie 2 ans
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}