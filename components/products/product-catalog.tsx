"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Heart, ShoppingBag, Star, Search, Filter, Grid, List, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { mockProducts, type Product } from "@/lib/mock-data"

interface ProductCatalogProps {
  defaultCategory?: string
  defaultSearch?: string
}

export function ProductCatalog({ defaultCategory = "all", defaultSearch = "" }: ProductCatalogProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(defaultSearch)
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [onlyOnSale, setOnlyOnSale] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setSearchQuery(defaultSearch)
  }, [defaultSearch])

  useEffect(() => {
    setSelectedCategory(defaultCategory)
  }, [defaultCategory])

  useEffect(() => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("q", searchQuery)
    if (selectedCategory !== "all") params.set("category", selectedCategory)
    if (selectedBrands.length > 0) params.set("brands", selectedBrands.join(","))
    if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","))
    if (selectedColors.length > 0) params.set("colors", selectedColors.join(","))
    if (priceRange[0] !== 0 || priceRange[1] !== 500) params.set("price", `${priceRange[0]}-${priceRange[1]}`)
    if (onlyInStock) params.set("inStock", "true")
    if (onlyOnSale) params.set("onSale", "true")
    if (sortBy !== "name") params.set("sort", sortBy)

    const newUrl = params.toString() ? `?${params.toString()}` : ""
    const currentUrl = window.location.search

    if (newUrl !== currentUrl) {
      router.replace(`${window.location.pathname}${newUrl}`, { scroll: false })
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedBrands,
    selectedSizes,
    selectedColors,
    priceRange,
    onlyInStock,
    onlyOnSale,
    sortBy,
    router,
  ])

  // Get unique values for filters
  const brands = Array.from(new Set(mockProducts.map((p) => p.brand)))
  const sizes = Array.from(new Set(mockProducts.flatMap((p) => p.sizes.map((s) => s.size)))).sort()
  const colors = Array.from(new Set(mockProducts.flatMap((p) => p.colors)))

  const filteredProducts = useMemo(() => {
    const filtered = mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "men" && product.category === "men") ||
        (selectedCategory === "women" && product.category === "women") ||
        (selectedCategory === "kids" && product.category === "kids") ||
        (selectedCategory === "sale" && product.onSale) ||
        (selectedCategory === "new" && product.isNew)

      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      const matchesSize =
        selectedSizes.length === 0 || selectedSizes.some((size) => product.sizes.some((s) => s.size === size))

      const matchesColor =
        selectedColors.length === 0 || selectedColors.some((color) => product.colors.some((c) => c.includes(color)))

      const matchesStock = !onlyInStock || product.sizes.reduce((total, size) => total + size.stock, 0) > 0

      const matchesSale = !onlyOnSale || product.onSale

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesSize &&
        matchesColor &&
        matchesStock &&
        matchesSale
      )
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "brand":
          return a.brand.localeCompare(b.brand)
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "rating":
          return 4.8 - 4.8 // Mock rating sort
        default:
          return 0
      }
    })

    return filtered
  }, [
    searchQuery,
    selectedCategory,
    selectedBrands,
    selectedSizes,
    selectedColors,
    priceRange,
    onlyInStock,
    onlyOnSale,
    sortBy,
  ])

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size])
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    }
  }

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, color])
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    }
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, 500])
    setOnlyInStock(false)
    setOnlyOnSale(false)
  }

  const activeFiltersCount =
    selectedBrands.length +
    selectedSizes.length +
    selectedColors.length +
    (onlyInStock ? 1 : 0) +
    (onlyOnSale ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 500 ? 1 : 0)

  return (
    <div className="container mx-auto px-4 py-8" id="products">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catalogue de sneakers</h1>
        <p className="text-muted-foreground">Découvrez notre collection complète de sneakers premium</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des sneakers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="men">Homme</SelectItem>
              <SelectItem value="women">Femme</SelectItem>
              <SelectItem value="kids">Enfant</SelectItem>
              <SelectItem value="new">Nouveautés</SelectItem>
              <SelectItem value="sale">Soldes</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="brand">Marque</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="newest">Plus récent</SelectItem>
              <SelectItem value="rating">Mieux notés</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden relative">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          {selectedBrands.map((brand) => (
            <Badge key={brand} variant="secondary" className="gap-1">
              {brand}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleBrandChange(brand, false)} />
            </Badge>
          ))}
          {selectedSizes.map((size) => (
            <Badge key={size} variant="secondary" className="gap-1">
              Taille {size}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleSizeChange(size, false)} />
            </Badge>
          ))}
          {selectedColors.map((color) => (
            <Badge key={color} variant="secondary" className="gap-1">
              {color}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleColorChange(color, false)} />
            </Badge>
          ))}
          {onlyInStock && (
            <Badge variant="secondary" className="gap-1">
              En stock
              <X className="h-3 w-3 cursor-pointer" onClick={() => setOnlyInStock(false)} />
            </Badge>
          )}
          {onlyOnSale && (
            <Badge variant="secondary" className="gap-1">
              En solde
              <X className="h-3 w-3 cursor-pointer" onClick={() => setOnlyOnSale(false)} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Tout effacer
          </Button>
        </div>
      )}

      <div className="flex gap-8">
        <aside className={`w-64 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
          {/* Quick Filters */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Filtres rapides</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="in-stock" checked={onlyInStock} onCheckedChange={setOnlyInStock} />
                  <Label htmlFor="in-stock" className="text-sm">
                    En stock uniquement
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="on-sale" checked={onlyOnSale} onCheckedChange={setOnlyOnSale} />
                  <Label htmlFor="on-sale" className="text-sm">
                    En solde uniquement
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brands */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Marques</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                    />
                    <Label htmlFor={brand} className="text-sm">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Tailles</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSizeChange(size, !selectedSizes.includes(size))}
                    className="h-8"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Couleurs</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={color}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                    />
                    <Label htmlFor={color} className="text-sm">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Prix</h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]}€</span>
                  <span>{priceRange[1]}€</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20"
                  />
                  <span>€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid/List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
            </p>
          </div>

          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun produit trouvé avec ces critères.</p>
              <Button variant="outline" onClick={clearAllFilters} className="mt-4 bg-transparent">
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && <Badge variant="default">Nouveau</Badge>}
            {product.onSale && (
              <Badge variant="destructive">
                -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick add to cart */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button className="w-full" size="sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Voir le produit
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">(4.8)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{product.price}€</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{product.originalPrice}€</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {product.sizes.reduce((total, size) => total + size.stock, 0)} en stock
            </div>
            <div className="flex gap-1">
              {product.colors.slice(0, 2).map((color, index) => (
                <div
                  key={index}
                  className="h-4 w-4 rounded-full border-2 border-background shadow-sm"
                  style={{
                    backgroundColor: color.includes("Noir") ? "#000" : color.includes("Blanc") ? "#fff" : "#8b5cf6",
                  }}
                />
              ))}
              {product.colors.length > 2 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductListItem({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <Link href={`/products/${product.id}`} className="flex-shrink-0">
            <div className="relative w-32 h-32 overflow-hidden rounded-lg">
              <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
          </Link>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors">{product.name}</h3>
                </Link>
              </div>

              <div className="flex gap-2">
                {product.isNew && <Badge variant="default">Nouveau</Badge>}
                {product.onSale && (
                  <Badge variant="destructive">
                    -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">(4.8)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{product.price}€</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">{product.originalPrice}€</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground">
                  {product.sizes.reduce((total, size) => total + size.stock, 0)} en stock
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Voir le produit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
