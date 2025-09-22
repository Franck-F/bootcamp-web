'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

export interface WishlistItem {
  id: number
  productId: number
  product: {
    id: number
    name: string
    price: number
    images: string[]
    brand: {
      name: string
    }
    category: {
      name: string
    }
    variants: Array<{
      id: number
      size: string
      color: string
      stock: number
    }>
  }
  addedAt: string
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
}

type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_WISHLIST' }

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload, error: null }
    
    case 'ADD_ITEM':
      return { 
        ...state, 
        items: [...state.items, action.payload], 
        error: null 
      }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
        error: null
      }
    
    case 'CLEAR_WISHLIST':
      return { ...state, items: [], error: null }
    
    default:
      return state
  }
}

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
  addToWishlist: (productId: number) => Promise<boolean>
  removeFromWishlist: (productId: number) => Promise<boolean>
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => Promise<void>
  loadWishlist: () => Promise<void>
  getWishlistCount: () => number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)
  const { data: session } = useSession()

  // Charger la wishlist au montage
  useEffect(() => {
    if (session?.user) {
      loadWishlist()
    }
  }, [session])

  const loadWishlist = async () => {
    if (!session?.user) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/wishlist')
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la wishlist')
      }
      
      const data = await response.json()
      dispatch({ type: 'LOAD_WISHLIST', payload: data.items })
      
    } catch (error) {
      console.error('Erreur loadWishlist:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement de la wishlist' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addToWishlist = async (productId: number): Promise<boolean> => {
    if (!session?.user) {
      dispatch({ type: 'SET_ERROR', payload: 'Vous devez être connecté pour ajouter à la wishlist' })
      return false
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'ajout à la wishlist')
      }

      const data = await response.json()
      dispatch({ type: 'ADD_ITEM', payload: data.item })
      
      return true
      
    } catch (error) {
      console.error('Erreur addToWishlist:', error)
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur lors de l\'ajout à la wishlist' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeFromWishlist = async (productId: number): Promise<boolean> => {
    if (!session?.user) {
      dispatch({ type: 'SET_ERROR', payload: 'Vous devez être connecté pour supprimer de la wishlist' })
      return false
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression de la wishlist')
      }

      dispatch({ type: 'REMOVE_ITEM', payload: productId })
      
      return true
      
    } catch (error) {
      console.error('Erreur removeFromWishlist:', error)
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur lors de la suppression de la wishlist' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const isInWishlist = (productId: number): boolean => {
    return state.items.some(item => item.productId === productId)
  }

  const clearWishlist = async (): Promise<void> => {
    if (!session?.user) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la wishlist')
      }

      dispatch({ type: 'CLEAR_WISHLIST' })
      
    } catch (error) {
      console.error('Erreur clearWishlist:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la suppression de la wishlist' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getWishlistCount = (): number => {
    return state.items.length
  }

  const value: WishlistContextType = {
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    loadWishlist,
    getWishlistCount,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

