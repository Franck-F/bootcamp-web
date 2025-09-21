'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Star, 
  ArrowRight, 
  Users, 
  Star as StarIcon, 
  Package, 
  ChevronDown,
  Zap,
  Shield,
  Crown,
  Sparkles
} from 'lucide-react'

export function HeroSectionNew() {
  const [featuredProduct] = useState({
    id: 1,
    name: 'Nike Air Force 1 \'Camo\'',
    brand: 'Nike',
    price: 405,
    originalPrice: 450,
    discount: 10,
    rating: 4.8,
    reviews: 1247,
    image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/products/main-square_107628ca-8acc-4f95-9a58-1922e8c31518.jpg?v=1695974200',
  })

  const scrollToNext = () => {
    const nextSection = document.querySelector('#featured-products')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full max-w-[80%] mx-auto">
          {/* Left Side - Content */}
          <div className="space-y-10">
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-3">
              <Crown className="w-5 h-5 text-red-400" />
              <span className="text-sm font-semibold text-white">Collection Premium 2024</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] font-display">
                Les sneakers
                <span className="block bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  qui changent tout
                </span>
              </h1>
              <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed font-light">
                Découvrez l'excellence absolue avec notre sélection de sneakers authentiques. 
                <span className="text-white font-medium">Style, qualité, exclusivité.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105">
                  Explorer la collection
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/products/nouveautes">
                <Button size="lg" variant="outline" className="border-2 border-gray-600 text-white hover:bg-gray-800/50 hover:border-gray-500 px-10 py-6 text-xl font-semibold rounded-2xl backdrop-blur-sm">
                  Voir les nouveautés
                </Button>
              </Link>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center group">
                <div className="text-4xl font-black text-white group-hover:text-red-400 transition-colors duration-300">500+</div>
                <div className="text-sm text-gray-400 font-medium">Modèles exclusifs</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-black text-white group-hover:text-red-400 transition-colors duration-300">50k+</div>
                <div className="text-sm text-gray-400 font-medium">Clients satisfaits</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-black text-white group-hover:text-red-400 transition-colors duration-300">4.9</div>
                <div className="text-sm text-gray-400 font-medium">Note moyenne</div>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Featured Product */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
              {/* Premium Discount Badge */}
              <div className="absolute -top-4 -right-4 z-20">
                <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  -{featuredProduct.discount}% OFF
                </div>
              </div>

              {/* Product Image with Glow Effect */}
              <div className="relative h-96 mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-full bg-white rounded-2xl overflow-hidden z-10">
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>

              {/* Enhanced Product Info Card */}
              <Card className="bg-black/95 backdrop-blur-md border-gray-700 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-3 py-1">
                        {featuredProduct.brand}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-400 text-sm font-medium">({featuredProduct.rating})</span>
                      </div>
                    </div>
                    
                    <h3 className="product-title text-2xl text-white leading-tight">{featuredProduct.name}</h3>
                    
                    <div className="flex items-center space-x-3">
                      <span className="product-price text-3xl text-white">
                        {featuredProduct.price.toFixed(2)}€
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {featuredProduct.originalPrice.toFixed(2)}€
                      </span>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl">
                      Ajouter au panier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Floating Elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-red-500/20 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 -left-12 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>

        {/* Animated Scroll Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={scrollToNext}
            className="group flex flex-col items-center space-y-2 text-white hover:text-red-400 transition-colors duration-300"
            aria-label="Faire défiler vers le bas"
          >
            <span className="text-sm font-medium opacity-70 group-hover:opacity-100">Découvrir</span>
            <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center group-hover:border-red-400 transition-colors duration-300">
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
