'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, User, Baby } from 'lucide-react'

const categories = [
  {
    id: 'MEN',
    name: 'Hommes',
    description: 'Sneakers tendance pour hommes',
    icon: User,
    image: '/images/category-men.jpg',
    color: 'from-blue-500 to-blue-700',
    href: '/products?category=MEN'
  },
  {
    id: 'WOMEN',
    name: 'Femmes',
    description: 'Sneakers élégantes pour femmes',
    icon: Users,
    image: '/images/category-women.jpg',
    color: 'from-pink-500 to-pink-700',
    href: '/products?category=WOMEN'
  },
  {
    id: 'CHILDREN',
    name: 'Enfants',
    description: 'Sneakers confortables pour enfants',
    icon: Baby,
    image: '/images/category-children.jpg',
    color: 'from-green-500 to-green-700',
    href: '/products?category=CHILDREN'
  }
]

export function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explorez nos catégories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de sneakers organisée par catégorie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={category.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                  <CardContent className="p-0">
                    <div className={`relative h-64 bg-gradient-to-br ${category.color} overflow-hidden`}>
                      <div className="absolute inset-0 bg-black opacity-20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-24 h-24 text-white opacity-80" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <p className="text-white opacity-90">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Découvrir la collection
                        </span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Voir tous les produits
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
