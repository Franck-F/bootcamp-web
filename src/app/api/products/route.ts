import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'edge' // Cloudflare Pages compatible

// GET - Récupérer tous les produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const brand = searchParams.get('brand') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const featured = searchParams.get('featured') === 'true'
    const isNew = searchParams.get('isNew') === 'true'
    const sale = searchParams.get('sale') === 'true'

    const skip = (page - 1) * limit

    // Construire les filtres
    const where: any = {
      is_active: true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.categories = {
        name: { contains: category, mode: 'insensitive' }
      }
    }

    if (brand) {
      where.brands = {
        name: { contains: brand, mode: 'insensitive' }
      }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (featured) {
      where.featured = true
    }

    if (isNew) {
      where.is_new = true
    }

    if (sale) {
      where.on_sale = true
    }

    // Récupérer les produits
    const products = await prisma.products.findMany({
      where,
      skip,
      take: limit,
      include: {
        brands: true,
        categories: true,
        variants: true,
        product_images: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Compter le total
    const total = await prisma.products.count({ where })

    // Formater les données
    const formattedProducts = products.map(product => ({
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: Number(product.price),
      originalPrice: null,
      brand: product.brands,
      category: product.categories,
      featured: product.featured || false,
      isNew: false,
      onSale: false,
      isActive: product.is_active || true,
      createdAt: product.created_at,
      variants: product.variants.map(variant => ({
        id: variant.id.toString(),
        size: variant.size,
        color: variant.color,
        price: Number(variant.price),
        stock: variant.stock,
        images: []
      })),
      images: product.product_images?.map(img => img.image_url) || []
    }))

    return NextResponse.json({
      products: formattedProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProducts: total
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST temporairement désactivé pour le déploiement Edge Runtime
