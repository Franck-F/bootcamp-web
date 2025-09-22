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
    image: '/fashion-shoes-sneakers.png',                       
  })

  const scrollToNext = () => {
    const nextSection = document.querySelector('#featured-products')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-r from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 overflow-hidden">                                              
      {/* Background Elements - Nike Style */}
      <div className="absolute inset-0">
        {/* Subtle Nike Swoosh Logo */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 opacity-5">
          <svg width="200" height="100" viewBox="0 0 200 100" className="text-gray-400 dark:text-white">
            <path d="M20 80 Q50 20 80 80 Q110 20 140 80 Q170 20 180 80" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 dark:via-black/20 to-transparent"></div>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">                                                               
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full max-w-[90%] mx-auto">                                                                    
          {/* Left Side - Content */}
          <div className="space-y-10 z-10">
            {/* Collection Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 dark:from-red-600/20 dark:to-pink-600/20 backdrop-blur-sm border border-red-500/30 dark:border-red-500/30 rounded-full px-6 py-3">                                                               
              <Crown className="w-5 h-5 text-red-400 dark:text-red-400" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white">Collection Premium {new Date().getFullYear()}</span>                                                                 
              <Sparkles className="w-4 h-4 text-yellow-400 dark:text-yellow-400" />
            </div>

            {/* Main Headline - Nike Style */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] font-display">                                                            
                Les sneakers
                <span className="block text-orange-500 dark:text-orange-500">                                 
                  qui changent tout
                </span>
              </h1>
              <div className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed font-light">                                                                       
                Découvrez l'excellence absolue avec notre sélection de sneakers authentiques.                                                                   
                <span className="text-gray-900 dark:text-white font-medium">Style, qualité, exclusivité.</span>                                                                    
              </div>
            </div>

            {/* CTA Button - Nike Style */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-10 py-6 text-xl font-bold rounded-none shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105">                                                      
                  Explorer la collection
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </div>

            {/* Review Section - Nike Style */}
            <div className="flex items-center space-x-4 pt-8">
              <div className="flex items-center space-x-2">
                <span className="text-4xl font-black text-white">4.9</span>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star className="w-5 h-5 text-yellow-400 fill-current" key={i} />
                  ))}
                </div>
              </div>
              <div className="text-white text-sm">
                <div>120k Total Review</div>
              </div>
            </div>

            {/* Squiggly Arrow */}
            <div className="absolute left-0 bottom-20 opacity-60">
              <svg width="60" height="80" viewBox="0 0 60 80" className="text-blue-400">
                <path d="M10 10 Q20 30 10 50 Q0 70 20 80" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Right Side - Featured Product */}
          <div className="relative z-10">
            {/* Main Product Image */}
            <div className="relative">
              <div className="relative h-[600px] w-full">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  className="object-contain transform rotate-12 hover:rotate-6 transition-transform duration-500"                                                      
                  priority
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5)) brightness(1.3) contrast(1.5) saturate(1.2)',
                    backgroundColor: 'transparent',
                    mixBlendMode: 'multiply',
                    WebkitFilter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5)) brightness(1.3) contrast(1.5) saturate(1.2)',
                    background: 'transparent'
                  }}
                />
              </div>
            </div>

            {/* Discount Offer Box */}
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 max-w-xs">
              <div className="text-xl font-bold">Jusqu'à 30% de réduction</div>
              <div className="text-sm opacity-90 mt-1">Vous pouvez obtenir jusqu'à 30% de réduction ici.</div>
            </div>

            {/* Squiggly Arrow pointing to offer */}
            <div className="absolute bottom-20 right-20 opacity-60">
              <svg width="40" height="60" viewBox="0 0 40 60" className="text-red-400">
                <path d="M5 5 Q15 25 5 45 Q-5 55 15 60" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
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
