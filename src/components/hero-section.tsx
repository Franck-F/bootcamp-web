'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white dark:from-blue-800 dark:to-purple-900">
      <div className="absolute inset-0 bg-black opacity-20 dark:opacity-30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Découvrez les{' '}
            <span className="text-yellow-400">meilleures</span>{' '}
            sneakers
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
            Collection exclusive de sneakers pour hommes, femmes et enfants. 
            Qualité premium, style unique, livraison rapide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200 text-lg px-8 py-4">
                Voir la collection
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/products?category=MEN">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-blue-700 text-lg px-8 py-4">
                Sneakers Hommes
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Livraison gratuite</h3>
              <p className="text-gray-600 dark:text-gray-400">À partir de 100€ d'achat</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Paiement sécurisé</h3>
              <p className="text-gray-600 dark:text-gray-400">Protection maximale</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Retour facile</h3>
              <p className="text-gray-600 dark:text-gray-400">30 jours pour changer d'avis</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Qualité premium</h3>
              <p className="text-gray-600 dark:text-gray-400">Marques reconnues</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
