'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Clock, Tag, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

interface SearchSuggestion {
  type: 'product' | 'brand' | 'category'
  id: number
  title: string
  subtitle: string
  image?: string
  price?: number
  url: string
}

interface SearchBarProps {
  className?: string
  placeholder?: string
}

export function SearchBar({ className = '', placeholder = 'Rechercher...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Fonction pour récupérer les suggestions
  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce pour éviter trop de requêtes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  // Gestion des événements clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else if (query.trim()) {
          handleSearch(query.trim())
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Gestion du clic sur une suggestion
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(-1)
    router.push(suggestion.url)
  }

  // Gestion de la recherche
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setIsOpen(false)
      setQuery('')
      setSelectedIndex(-1)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Gestion du clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Icône selon le type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4" />
      case 'brand':
        return <Tag className="w-4 h-4" />
      case 'category':
        return <Clock className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Input de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64 text-white placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
              setIsOpen(false)
              setSelectedIndex(-1)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto mb-2"></div>
              Recherche en cours...
            </div>
          ) : (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-700 transition-colors ${
                    index === selectedIndex ? 'bg-gray-700' : ''
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${
                    index === suggestions.length - 1 ? 'rounded-b-lg' : ''
                  }`}
                >
                  {/* Icône */}
                  <div className="flex-shrink-0 text-gray-400">
                    {getTypeIcon(suggestion.type)}
                  </div>

                  {/* Image pour les produits */}
                  {suggestion.type === 'product' && suggestion.image && (
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={suggestion.image}
                        alt={suggestion.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  )}

                  {/* Contenu */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-white font-medium truncate">
                      {suggestion.title}
                    </div>
                    <div className="text-gray-400 text-sm truncate">
                      {suggestion.subtitle}
                    </div>
                    {suggestion.price && (
                      <div className="text-red-400 text-sm font-semibold">
                        {formatPrice(suggestion.price)}
                      </div>
                    )}
                  </div>

                  {/* Type badge */}
                  <div className="flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.type === 'product' 
                        ? 'bg-blue-600/20 text-blue-400' 
                        : suggestion.type === 'brand'
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-purple-600/20 text-purple-400'
                    }`}>
                      {suggestion.type === 'product' ? 'Produit' : 
                       suggestion.type === 'brand' ? 'Marque' : 'Catégorie'}
                    </span>
                  </div>
                </button>
              ))}

              {/* Bouton de recherche générale */}
              {query.trim() && (
                <div className="border-t border-gray-700">
                  <button
                    onClick={() => handleSearch(query.trim())}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700 transition-colors rounded-b-lg"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">
                        Rechercher "{query}"
                      </div>
                      <div className="text-gray-400 text-sm">
                        Voir tous les résultats
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
