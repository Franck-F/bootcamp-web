'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Search, 
  Euro, 
  ChevronDown, 
  Filter,
  SlidersHorizontal
} from 'lucide-react'

interface Filters {
  category: string
  search: string
  minPrice: string
  maxPrice: string
  sortBy: string
  brand: string
}

interface ProductFiltersProps {
  filters: Filters
  onFilterChange: (filters: Partial<Filters>) => void
  onClose?: () => void
}

const categories = [
  { value: 'Sneakers', label: 'Sneakers' },
  { value: 'Marathon Running Shoes/Sneakers', label: 'Running' },
  { value: 'Infant/Toddler Shoes', label: 'Chaussures Enfant' },
  { value: 'Basketball Shoes/Sneakers', label: 'Basketball' },
  { value: 'Athletic Shoes', label: 'Athlétiques' },
  { value: 'Training Shoes/Sneakers', label: 'Training' },
  { value: 'Sandals', label: 'Sandales' },
  { value: 'Skate Shoes', label: 'Skate' },
  { value: 'Canvas Shoes/Sneakers', label: 'Canvas' },
]

const sortOptions = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'popular', label: 'Plus populaires' },
]

const popularBrands = [
  { value: 'Nike', label: 'Nike' },
  { value: 'Adidas', label: 'Adidas' },
  { value: 'Air Jordan', label: 'Air Jordan' },
  { value: 'Converse', label: 'Converse' },
  { value: 'Puma', label: 'Puma' },
  { value: 'New Balance', label: 'New Balance' },
  { value: 'Asics', label: 'Asics' },
  { value: 'Balenciaga', label: 'Balenciaga' },
]

export function ProductFilters({ filters, onFilterChange, onClose }: ProductFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice ? parseInt(filters.minPrice) : 0,
    max: filters.maxPrice ? parseInt(filters.maxPrice) : 1000
  })

  const categoryRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)

  // Fermer les dropdowns quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setIsCategoryOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(target)) {
        setIsSortOpen(false)
      }
      if (brandRef.current && !brandRef.current.contains(target)) {
        setIsBrandOpen(false)
      }
    }

    // Vérifier que le document existe avant d'ajouter l'event listener
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [])

  const handleSearch = () => {
    onFilterChange({ search: localSearch })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...priceRange, [type]: value }
    setPriceRange(newRange)
    onFilterChange({
      minPrice: newRange.min.toString(),
      maxPrice: newRange.max.toString()
    })
  }

  const getSelectedCategory = () => {
    return categories.find(cat => cat.value === filters.category)?.label || 'Toutes les catégories'
  }

  const getSelectedSort = () => {
    return sortOptions.find(opt => opt.value === filters.sortBy)?.label || 'Plus récents'
  }

  const getSelectedBrand = () => {
    return popularBrands.find(brand => brand.value === filters.brand)?.label || 'Toutes les marques'
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm relative z-10">
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Recherche */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un produit..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 w-full lg:w-80"
            />
          </div>
        </div>

        {/* Dropdown Catégories */}
        <div className="relative" ref={categoryRef}>
          <Button
            variant="outline"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="border-gray-600 text-white hover:bg-gray-700 min-w-[180px] justify-between"
          >
            <span>{getSelectedCategory()}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[100] max-h-60 overflow-y-auto">
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-700"
                  onClick={() => {
                    onFilterChange({ category: '' })
                    setIsCategoryOpen(false)
                  }}
                >
                  Toutes les catégories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-gray-700"
                    onClick={() => {
                      onFilterChange({ category: category.value })
                      setIsCategoryOpen(false)
                    }}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Tri */}
        <div className="relative" ref={sortRef}>
          <Button
            variant="outline"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="border-gray-600 text-white hover:bg-gray-700 min-w-[160px] justify-between"
          >
            <span>{getSelectedSort()}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {isSortOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[100] max-h-60 overflow-y-auto">
              <div className="p-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-gray-700"
                    onClick={() => {
                      onFilterChange({ sortBy: option.value })
                      setIsSortOpen(false)
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Marques */}
        <div className="relative" ref={brandRef}>
          <Button
            variant="outline"
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="border-gray-600 text-white hover:bg-gray-700 min-w-[140px] justify-between"
          >
            <span>{getSelectedBrand()}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {isBrandOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[100] max-h-60 overflow-y-auto">
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-700"
                  onClick={() => {
                    onFilterChange({ brand: '' })
                    setIsBrandOpen(false)
                  }}
                >
                  Toutes les marques
                </Button>
                {popularBrands.map((brand) => (
                  <Button
                    key={brand.value}
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-gray-700"
                    onClick={() => {
                      onFilterChange({ brand: brand.value })
                      setIsBrandOpen(false)
                    }}
                  >
                    {brand.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jauge de Prix */}
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="flex items-center space-x-2">
            <Euro className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Prix:</span>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
              className="w-20 bg-gray-900/50 border-gray-600 text-white text-center focus:border-red-500"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 1000)}
              className="w-20 bg-gray-900/50 border-gray-600 text-white text-center focus:border-red-500"
            />
          </div>
        </div>

        {/* Bouton Effacer */}
        <Button
          variant="ghost"
          onClick={() => {
            onFilterChange({
              category: '',
              search: '',
              minPrice: '',
              maxPrice: '',
              sortBy: 'newest',
              brand: ''
            })
            setLocalSearch('')
            setPriceRange({ min: 0, max: 1000 })
          }}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4 mr-2" />
          Effacer
        </Button>
      </div>
    </div>
  )
}