"use client"

import { useState, useEffect } from "react"

export interface Product {
  id: string
  name: string
  description: string
  brand: string
  category: "men" | "women" | "kids"
  price: number
  originalPrice?: number
  images: string[]
  colors: string[]
  sizes: { size: string; stock: number }[]
  featured: boolean
  isNew: boolean
  onSale: boolean
  createdAt: string
}

interface UseProductsOptions {
  category?: string
  brand?: string
  search?: string
  page?: number
  limit?: number
}

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  refetch: () => void
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.category) params.set("category", options.category)
      if (options.brand) params.set("brand", options.brand)
      if (options.search) params.set("search", options.search)
      if (options.page) params.set("page", options.page.toString())
      if (options.limit) params.set("limit", options.limit.toString())

      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [options.category, options.brand, options.search, options.page, options.limit])

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
  }
}
