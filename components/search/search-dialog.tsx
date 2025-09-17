"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, TrendingUp, Filter } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"
import Image from "next/image"
import Link from "next/link"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Filter products based on search query
  const searchResults =
    query.length > 0
      ? mockProducts
          .filter(
            (product) =>
              product.name.toLowerCase().includes(query.toLowerCase()) ||
              product.brand.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 6)
      : []

  const popularSearches = ["Nike", "Adidas", "Jordan", "Yeezy", "Dunk", "Air Force"]

  const categorySearches = [
    { label: "Sneakers Homme", category: "men" },
    { label: "Sneakers Femme", category: "women" },
    { label: "Sneakers Enfant", category: "kids" },
    { label: "Nouveautés", category: "new" },
    { label: "Soldes", category: "sale" },
  ]

  const handleSearch = (searchQuery: string, category?: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      // Navigate to search page with optional category filter
      const params = new URLSearchParams()
      params.set("q", searchQuery)
      if (category) {
        params.set("category", category)
      }

      router.push(`/search?${params.toString()}`)
      onOpenChange(false)
      setQuery("")
    }
  }

  const handleCategorySearch = (category: string, label: string) => {
    const updated = [label, ...recentSearches.filter((s) => s !== label)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))

    router.push(`/${category === "new" ? "nouveautes" : category === "sale" ? "soldes" : category}`)
    onOpenChange(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="sr-only">Rechercher des produits</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des sneakers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 text-lg h-12"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto">
          {query.length > 0 ? (
            // Search Results
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Résultats</h3>
                {searchResults.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => handleSearch(query)}>
                    Voir tous les résultats
                  </Button>
                )}
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{product.price}€</p>
                        {product.onSale && (
                          <Badge variant="destructive" className="text-xs">
                            Solde
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun résultat trouvé pour "{query}"</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={() => handleSearch(query)}>
                    Rechercher quand même
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Default state
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Parcourir par catégorie
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categorySearches.map((item) => (
                    <Button
                      key={item.category}
                      variant="outline"
                      size="sm"
                      onClick={() => handleCategorySearch(item.category, item.label)}
                      className="text-sm justify-start"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recherches récentes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearch(search)}
                        className="text-sm"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recherches populaires
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(search)}
                      className="text-sm"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
