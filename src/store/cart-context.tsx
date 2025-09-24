'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

export interface CartItem {
  productId: string
  size: string
  quantity: number
  addedAt: string
  product?: {
    id: string
    name: string
    brand: string
    price: number
    images: string[]
    availableStock: number
    category?: string
  }
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'UPDATE_ITEM_DETAILS'; payload: { productId: string; size: string; product: CartItem['product'] } }

const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && item.size === action.payload.size
      )
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: updatedItems, error: null }
      }
      
      return { ...state, items: [...state.items, action.payload], error: null }
    }
    
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === action.payload.productId && item.size === action.payload.size)
        ),
        error: null
      }
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            item => !(item.productId === action.payload.productId && item.size === action.payload.size)
          ),
          error: null
        }
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        error: null
      }
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], error: null }
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'LOAD_CART':
      return { ...state, items: action.payload, isLoading: false, error: null }
    
    case 'UPDATE_ITEM_DETAILS': {
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId && item.size === action.payload.size
            ? { ...item, product: action.payload.product }
            : item
        )
      }
    }
    
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (isOpen: boolean) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getSubtotal: () => number
  getTax: () => number
  getShipping: () => number
  getDiscount: () => number
  loadCart: () => Promise<void>
  saveCart: () => void
  validateStock: (productId: string, size: string, quantity: number) => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    loadCart()
  }, [])
  
  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    if (state.items.length > 0) {
      saveCart()
    }
  }, [state.items])
  
  const addItem = async (item: CartItem) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Valider le stock avant d'ajouter
      const isValidStock = await validateStock(item.productId, item.size, item.quantity)
      if (!isValidStock) {
        dispatch({ type: 'SET_ERROR', payload: 'Stock insuffisant pour ce produit' })
        return
      }
      
      // Récupérer les détails du produit
      const productDetails = await fetchProductDetails(item.productId)
      if (productDetails) {
        item.product = productDetails
      }
      
      dispatch({ type: 'ADD_ITEM', payload: item })
      
      // Sauvegarder dans l'API
      await saveCartToAPI()
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de l\'ajout au panier' })
      console.error('Erreur addItem:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }
  
  const removeItem = (productId: string, size: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } })
  }

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, quantity } })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }
  
  const setCartOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: isOpen })
  }
  
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }
  
  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }
  
  const getTax = () => {
    // TVA française 20%
    return getSubtotal() * 0.20
  }
  
  const getShipping = () => {
    const subtotal = getSubtotal()
    // Livraison gratuite à partir de 100€
    return subtotal >= 100 ? 0 : 9.99
  }
  
  const getDiscount = () => {
    // Pas de réduction par défaut, peut être étendu
    return 0
  }
  
  const getTotalPrice = () => {
    return getSubtotal() + getTax() + getShipping() - getDiscount()
  }
  
  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Charger depuis localStorage
      const savedCart = localStorage.getItem('sneakpeak-cart')
      if (savedCart) {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      }
      
      // Charger depuis l'API si l'utilisateur est connecté
      const response = await fetch('/api/cart')
      if (response.ok) {
        const apiCart = await response.json()
        if (apiCart.length > 0) {
          dispatch({ type: 'LOAD_CART', payload: apiCart })
        }
      }
      
    } catch (error) {
      console.error('Erreur loadCart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement du panier' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }
  
  const saveCart = () => {
    try {
      localStorage.setItem('sneakpeak-cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Erreur saveCart:', error)
    }
  }
  
  const saveCartToAPI = async () => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state.items),
      })
    } catch (error) {
      console.error('Erreur saveCartToAPI:', error)
    }
  }
  
  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const product = await response.json()
        return {
          id: product.id.toString(),
          name: product.name,
          brand: product.brands?.name || 'Marque inconnue',
          price: product.price,
          images: product.images || [],
          availableStock: product.variants?.reduce((total: number, variant: any) => total + variant.stock, 0) || 0,
          category: product.categories?.name
        }
      }
    } catch (error) {
      console.error('Erreur fetchProductDetails:', error)
    }
    return null
  }
  
  const validateStock = async (productId: string, size: string, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const product = await response.json()
        const variant = product.variants?.find((v: any) => v.size === size)
        return variant && variant.stock >= quantity
      }
    } catch (error) {
      console.error('Erreur validateStock:', error)
    }
    return false
  }
  
  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        getTotalItems,
        getTotalPrice,
        getSubtotal,
        getTax,
        getShipping,
        getDiscount,
        loadCart,
        saveCart,
        validateStock,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
