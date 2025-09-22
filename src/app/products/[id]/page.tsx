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
  Check
} from 'lucide-react'
import { WishlistButton } from '@/components/wishlist-button'

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

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Produit non trouvé')
        }
        
        const data = await response.json()
        setProduct(data)
        
        // Sélectionner la première variante par défaut
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
          setSelectedSize(data.variants[0].size || '')
          setSelectedColor(data.variants[0].color || '')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const addToCart = async () => {
    if (!product || !selectedVariant) return

    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant.id,
          quantity: quantity
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
      setAddingToCart(false)
    }
  }


  const selectVariant = (variant: any) => {
    setSelectedVariant(variant)
    setSelectedSize(variant.size || '')
    setSelectedColor(variant.color || '')
    
    // Changer l'image principale basé sur la couleur ou utiliser un index aléatoire
    if (product && product.product_images.length > 1) {
      const colorIndex = colors.indexOf(variant.color || '')
      if (colorIndex >= 0 && colorIndex < product.product_images.length) {
        setSelectedImageIndex(colorIndex)
      } else {
        // Si pas de correspondance de couleur, utiliser un index basé sur l'ID du variant
        const imageIndex = variant.id % product.product_images.length
        setSelectedImageIndex(imageIndex)
      }
    }
  }

  const selectImage = (index: number) => {
    setSelectedImageIndex(index)
  }

  const formatSize = (sizeString: string) => {
    if (!sizeString) return 'Unique'
    
    // Extraire la taille EU (normes européennes)
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

  const getUniqueSizes = () => {
    if (!product) return []
    const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean)))
    return uniqueSizes.sort((a, b) => {
      // Trier par taille numérique si possible
      const aNum = parseFloat((a || '').match(/\d+(?:\.\d+)?/)?.[0] || '0')
      const bNum = parseFloat((b || '').match(/\d+(?:\.\d+)?/)?.[0] || '0')
      return aNum - bNum
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement du produit...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Produit non trouvé</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <Button onClick={() => router.back()} className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const sizes = getUniqueSizes()
  const colors = product ? Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) : []

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Images */}
          <div className="space-y-6">
            <div className="relative h-96 lg:h-[500px] bg-white rounded-2xl overflow-hidden">
              {product.product_images && product.product_images.length > 0 ? (
                <Image
                  src={product.product_images[selectedImageIndex].image_url}
                  alt={product.product_images[selectedImageIndex].alt_text || product.name}
                  fill
                  className="object-contain p-8 transition-all duration-300"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                  Image non disponible
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.product_images && product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.product_images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative h-20 bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index 
                        ? 'border-red-500 ring-2 ring-red-500/20' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    title={`Voir l'image ${index + 1}`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Badge className="bg-gray-700 text-gray-300">
                  {product.brands.name}
                </Badge>
                {product.isNew && (
                  <Badge className="bg-blue-600 text-white">
                    Nouveau
                  </Badge>
                )}
                {product.onSale && (
                  <Badge className="bg-red-600 text-white">
                    En solde
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{product.averageRating}</span>
                  <span className="text-gray-400">({product.totalReviews} avis)</span>
                </div>
                <Badge className="bg-gray-700 text-gray-300">
                  {product.categories.name}
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-white">
                  {product.price}€
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    {product.originalPrice}€
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-600 text-white">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants */}
            <div className="space-y-6">
              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Couleur</h3>
                  <div className="flex space-x-3">
                    {colors.map((color) => {
                      const variant = product.variants.find(v => v.color === color)
                      return (
                        <button
                          key={color}
                          onClick={() => variant && selectVariant(variant)}
                          disabled={!variant || variant.stock === 0}
                          className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                            selectedColor === color 
                              ? 'border-white ring-2 ring-white/50' 
                              : variant && variant.stock > 0
                              ? 'border-gray-600 hover:border-gray-400 hover:scale-110'
                              : 'border-gray-700 opacity-50 cursor-not-allowed'
                          }`}
                          style={{ backgroundColor: color }}
                          title={`${color}${variant && variant.stock === 0 ? ' (Rupture)' : ''}`}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Taille</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {sizes.map((size) => {
                      const variant = product.variants.find(v => v.size === size)
                      const isSelected = selectedSize === size
                      const isAvailable = variant && variant.stock > 0
                      
                      return (
                        <button
                          key={size}
                          onClick={() => variant && selectVariant(variant)}
                          disabled={!isAvailable}
                          className={`relative py-3 px-2 rounded-lg border-2 text-center font-medium transition-all duration-200 ${
                            isSelected
                              ? 'border-red-500 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/20'
                              : isAvailable
                              ? 'border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-800/50 hover:scale-105'
                              : 'border-gray-700 text-gray-500 bg-gray-800/30 cursor-not-allowed opacity-50'
                          }`}
                          title={isAvailable ? `${size} - En stock` : `${size} - Rupture de stock`}
                        >
                          <div className="text-sm font-semibold">
                            {formatSize(size || '')}
                          </div>
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 border border-gray-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-0.5 bg-gray-500"></div>
                              </div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Quantité</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold text-white w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={addToCart}
                  disabled={addingToCart || !selectedVariant}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 text-lg rounded-xl"
                >
                  {addingToCart ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {addingToCart ? 'Ajout...' : 'Ajouter au panier'}
                </Button>
                <WishlistButton 
                  productId={product.id}
                  size="icon"
                  variant="outline"
                  className="border-2 border-gray-600 text-gray-300 hover:border-gray-400 dark:border-gray-400 dark:text-gray-300 dark:hover:border-gray-300"
                />
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Livraison gratuite</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Garantie 2 ans</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Retour 30 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
