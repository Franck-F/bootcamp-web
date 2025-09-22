import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const searchTerm = query.toLowerCase()

    // Recherche dans les produits, marques et catégories
    const [products, brands, categories] = await Promise.all([
      // Recherche dans les produits
      prisma.products.findMany({
        where: {
          AND: [
            { is_active: true },
            {
              OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } }
              ]
            }
          ]
        },
        include: {
          brands: true,
          categories: true,
          product_images: true
        },
        take: 5
      }),

      // Recherche dans les marques
      prisma.brands.findMany({
        where: {
          name: { contains: searchTerm, mode: 'insensitive' }
        },
        take: 3
      }),

      // Recherche dans les catégories
      prisma.categories.findMany({
        where: {
          name: { contains: searchTerm, mode: 'insensitive' }
        },
        take: 3
      })
    ])

    // Formater les suggestions
    const suggestions: any[] = []

    // Ajouter les produits
    products.forEach(product => {
      suggestions.push({
        type: 'product',
        id: product.id,
        title: product.name,
        subtitle: `${product.brands?.name || 'Marque inconnue'} • ${product.categories?.name || 'Catégorie inconnue'}`,
        image: product.product_images[0]?.image_url || '/images/placeholder-sneaker.jpg',
        price: product.price,
        url: `/products/${product.id}`
      })
    })

    // Ajouter les marques
    brands.forEach(brand => {
      suggestions.push({
        type: 'brand',
        id: brand.id,
        title: brand.name,
        subtitle: 'Marque',
        url: `/products?brand=${encodeURIComponent(brand.name)}`
      })
    })

    // Ajouter les catégories
    categories.forEach(category => {
      suggestions.push({
        type: 'category',
        id: category.id,
        title: category.name,
        subtitle: 'Catégorie',
        url: `/products?category=${encodeURIComponent(category.name)}`
      })
    })

    // Limiter à 8 suggestions au total
    return NextResponse.json({ 
      suggestions: suggestions.slice(0, 8),
      total: suggestions.length
    })

  } catch (error) {
    console.error('Erreur lors de la recherche de suggestions:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
