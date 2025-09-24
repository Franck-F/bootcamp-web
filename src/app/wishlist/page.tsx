'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWishlist } from '@/store/wishlist-context'
import { useCart } from '@/store/cart-context'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye, 
  Star,
  ArrowLeft,
  Package
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'react-hot-toast'

export default function WishlistPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { items, isLoading, error, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)

  // Rediriger si non connecté
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  const handleAddToCart = async (product: any) => {
    setAddingToCart(product.id)
    try {
      const availableVariant = product.variants.find((variant: any) => variant.stock > 0)
      if (availableVariant) {
        await addItem({
          productId: product.id.toString(),
          size: availableVariant.size || 'Unique',
          quantity: 1,
          addedAt: new Date().toISOString(),
        })
        toast.success('Produit ajouté au panier')
      } else {
        toast.error('Produit en rupture de stock')
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
      toast.error('Erreur lors de l\'ajout au panier')
    } finally {
      setAddingToCart(null)
    }
  }

  const handleRemoveFromWishlist = async (productId: number) => {
    setRemoving(productId)
    try {
      const success = await removeFromWishlist(productId)
      if (success) {
        toast.success('Produit retiré de vos favoris')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression')
    } finally {
      setRemoving(null)
    }
  }

  const handleClearWishlist = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre wishlist ?')) {
      try {
        await clearWishlist()
        toast.success('Wishlist vidée')
      } catch (error) {
        console.error('Erreur lors du vidage:', error)
        toast.error('Erreur lors du vidage de la wishlist')
      }
    }
  }

  const getAvailableSizes = (product: any) => {
    return product.variants.filter((variant: any) => variant.stock > 0)
  }

  const isInStock = (product: any) => {
    return getAvailableSizes(product).length > 0
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-[90%] mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Connexion requise
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Vous devez être connecté pour accéder à votre wishlist
          </p>
          <Button onClick={() => router.push('/auth/signin')}>
            Se connecter
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-[90%] mx-auto">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Erreur
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Ma Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {items.length} {items.length === 1 ? 'produit' : 'produits'} sauvegardé{items.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vider la wishlist
            </Button>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Votre wishlist est vide
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Découvrez nos produits et ajoutez vos favoris en cliquant sur le cœur
            </p>
            <Button onClick={() => router.push('/products')}>
              Découvrir nos produits
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              const product = item.product
              const availableSizes = getAvailableSizes(product)
              const inStock = isInStock(product)

              return (
                <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square relative bg-white dark:bg-gray-800">
                        <Image
                          src={product.images[0] || '/fashion-shoes-sneakers.png'}
                          alt={product.name}
                          fill
                          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                        />
                        {!inStock && (
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
                        {product.category.name}
                      </Badge>
                    </div>
                    
                    <div className="absolute top-2 right-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        disabled={removing === product.id}
                      >
                        {removing === product.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {product.brand.name}
                      </p>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        (4.0)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </div>
                      {availableSizes.length > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {availableSizes.length} taille{availableSizes.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock || addingToCart === product.id}
                        className="flex-1"
                      >
                        {addingToCart === product.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        {addingToCart === product.id ? 'Ajout...' : 'Panier'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
