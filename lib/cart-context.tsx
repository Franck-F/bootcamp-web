"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "./mock-data"
import { mockProducts } from "./mock-data"

export interface CartItem {
  productId: string
  size: string
  quantity: number
  color: string
}

export interface CartItemWithProduct extends CartItem {
  product: Product
}

interface CartContextType {
  items: CartItem[]
  itemsWithProducts: CartItemWithProduct[]
  totalItems: number
  totalPrice: number
  addItem: (productId: string, size: string, quantity: number, color: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string, size: string, color: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sneakpeak_cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("sneakpeak_cart", JSON.stringify(items))
  }, [items])

  // Get items with full product data
  const itemsWithProducts: CartItemWithProduct[] = items
    .map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId)
      if (!product) return null
      return { ...item, product }
    })
    .filter(Boolean) as CartItemWithProduct[]

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = itemsWithProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const addItem = (productId: string, size: string, quantity: number, color: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === productId && item.size === size && item.color === color,
      )

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, { productId, size, quantity, color }]
      }
    })
  }

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.productId === productId && item.size === size && item.color === color)),
    )
  }

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.size === size && item.color === color ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (productId: string, size: string, color: string) => {
    return items.some((item) => item.productId === productId && item.size === size && item.color === color)
  }

  const value = {
    items,
    itemsWithProducts,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
