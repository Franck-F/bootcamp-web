'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/store/wishlist-context'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'react-hot-toast'

interface WishlistButtonProps {
  productId: number
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
  showText?: boolean
  disabled?: boolean
}

export function WishlistButton({ 
  productId, 
  size = 'icon', 
  variant = 'ghost',
  className = '',
  showText = false,
  disabled = false
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading } = useWishlist()
  const { user } = useAuth()
  const [isToggling, setIsToggling] = useState(false)

  const isFavorite = isInWishlist(productId)

  const handleToggle = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour utiliser la wishlist')
      return
    }

    if (disabled || isLoading || isToggling) return

    setIsToggling(true)

    try {
      if (isFavorite) {
        const success = await removeFromWishlist(productId)
        if (success) {
          toast.success('Produit retiré de vos favoris')
        }
      } else {
        const success = await addToWishlist(productId)
        if (success) {
          toast.success('Produit ajouté à vos favoris')
        }
      }
    } catch (error) {
      console.error('Erreur lors du toggle wishlist:', error)
      toast.error('Erreur lors de la mise à jour de vos favoris')
    } finally {
      setIsToggling(false)
    }
  }

  const getButtonContent = () => {
    if (showText) {
      return (
        <>
          <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
          {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </>
      )
    }

    return (
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
    )
  }

  const getButtonVariant = () => {
    if (variant === 'ghost' && isFavorite) {
      return 'ghost'
    }
    return variant
  }

  const getButtonClassName = () => {
    const baseClasses = className
    
    if (isFavorite) {
      return `${baseClasses} text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300`
    }
    
    return `${baseClasses} text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400`
  }

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      onClick={handleToggle}
      disabled={disabled || isLoading || isToggling}
      className={getButtonClassName()}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {isToggling ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        getButtonContent()
      )}
    </Button>
  )
}

