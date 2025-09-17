"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "./mock-data"
import { mockProducts } from "./mock-data"

export interface WishlistItem {
  productId: string
  addedAt: Date
}

export interface WishlistItemWithProduct extends WishlistItem {
  product: Product
}

interface WishlistContextType {
  items: WishlistItem[]
  itemsWithProducts: WishlistItemWithProduct[]
  totalItems: number
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("sneakpeak_wishlist")
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist)
        // Convert date strings back to Date objects
        const itemsWithDates = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }))
        setItems(itemsWithDates)
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("sneakpeak_wishlist", JSON.stringify(items))
  }, [items])

  // Get items with full product data
  const itemsWithProducts: WishlistItemWithProduct[] = items
    .map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId)
      if (!product) return null
      return { ...item, product }
    })
    .filter(Boolean) as WishlistItemWithProduct[]

  const totalItems = items.length

  const addItem = (productId: string) => {
    setItems((prevItems) => {
      const exists = prevItems.some((item) => item.productId === productId)
      if (exists) return prevItems

      return [...prevItems, { productId, addedAt: new Date() }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId)
  }

  const toggleItem = (productId: string) => {
    if (isInWishlist(productId)) {
      removeItem(productId)
    } else {
      addItem(productId)
    }
  }

  const value = {
    items,
    itemsWithProducts,
    totalItems,
    addItem,
    removeItem,
    isInWishlist,
    toggleItem,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
