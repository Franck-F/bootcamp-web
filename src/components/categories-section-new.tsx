'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  count: string
  image: string
  href: string
}

export function CategoriesSectionNew() {
  const categories: Category[] = [
    {
      id: 'sneakers',
      name: 'Sneakers',
      description: 'Style urbain et performance',
      count: '709+ modèles',
      image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_43f9b61e-dc1b-4896-913f-427ec0e5927a.jpg?v=1723599056',
      href: '/products/homme'
    },
    {
      id: 'running',
      name: 'Running',
      description: 'Performance et confort',
      count: '103+ modèles',
      image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_3a1ff23a-ce11-48e5-9123-4c8e4988e3d7.jpg?v=1708692802',
      href: '/products/femme'
    },
    {
      id: 'kids',
      name: 'Enfant',
      description: 'Couleurs et durabilité',
      count: '15+ modèles',
      image: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/main-square_a59cf361-5d0b-48f9-b2ab-7d3d08f8b2ae.jpg?v=1708769361',
      href: '/products/enfant'
    }
  ]

  return (
    <section className="py-20 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Explorez par catégorie
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Trouvez la paire parfaite selon votre style et vos besoins.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={category.href}>
              <div className="group relative overflow-hidden rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                {/* Background Image */}
                <div className="relative h-80">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">
                        {category.name}
                      </h3>
                      <p className="text-gray-300 text-lg">
                        {category.description}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {category.count}
                      </p>
                      
                      {/* CTA Button */}
                      <Button 
                        size="sm" 
                        className="bg-white text-black hover:bg-gray-100 mt-4"
                      >
                        Explorer
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
