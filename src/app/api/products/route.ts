import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations'
import { sanitizeInput } from '@/lib/utils'

export const runtime = 'nodejs'

// GET - Récupérer tous les produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const brand = searchParams.get('brand')
    const sortBy = searchParams.get('sortBy')
    const featured = searchParams.get('featured')
    const isNew = searchParams.get('new')
    const sale = searchParams.get('sale')
    
    const skip = (page - 1) * limit
    
    // Construction des filtres
    const where: any = {
      is_active: true,
    }
    
    if (category) {
      where.categories = {
        name: category
      }
    }
    
    if (brand) {
      where.brands = {
        name: brand
      }
    }
    
    if (featured === 'true') {
      // Pour les produits featured, on filtre par le champ featured = true
      where.featured = true
    }
    
    if (isNew === 'true') {
      // Pour les produits nouveaux
      where.isNew = true
    }
    
    if (sale === 'true') {
      // Pour les produits en solde
      where.onSale = true
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brands: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    
    // Marques prioritaires selon les catégories
    const priorityBrands = ['Nike', 'Adidas', 'Air Jordan', 'Puma', 'New Balance', 'Converse', 'Vans']
    
    // Construction du tri avec priorité des marques
    let orderBy: any = { created_at: 'desc' }
    if (featured === 'true') {
      // Pour les produits featured, on trie par ID pour avoir des résultats cohérents
      orderBy = { id: 'asc' }
    } else if (sortBy) {
      switch (sortBy) {
        case 'newest':
          orderBy = { created_at: 'desc' }
          break
        case 'oldest':
          orderBy = { created_at: 'asc' }
          break
        case 'price-low':
          orderBy = { price: 'asc' }
          break
        case 'price-high':
          orderBy = { price: 'desc' }
          break
        case 'rating':
          orderBy = { averageRating: 'desc' }
          break
        case 'popular':
          orderBy = { totalReviews: 'desc' }
          break
        default:
          orderBy = { created_at: 'desc' }
      }
    }
    
    // Récupérer d'abord les produits des marques prioritaires
    const priorityWhere = {
      ...where,
      brands: {
        name: { in: priorityBrands }
      }
    }
    
    const [priorityProducts, otherProducts, total] = await Promise.all([
      prisma.products.findMany({
        where: priorityWhere,
        include: {
          variants: true,
          brands: true,
          categories: true,
          product_images: true,
        },
        orderBy
      }),
      prisma.products.findMany({
        where: {
          ...where,
          brands: {
            name: { notIn: priorityBrands }
          }
        },
        include: {
          variants: true,
          brands: true,
          categories: true,
          product_images: true,
        },
        orderBy
      }),
      prisma.products.count({ where })
    ])
    
    // Combiner les produits en priorisant les marques prioritaires
    const allProducts = [...priorityProducts, ...otherProducts]
    
    // Appliquer la pagination sur la liste combinée
    const products = allProducts.slice(skip, skip + limit)
    
    // Formatage des produits pour la réponse
    const formattedProducts = products.map(product => ({
      ...product,
      price: Number(product.price), // S'assurer que le prix est un nombre
      images: product.product_images?.map(img => img.image_url) || [],
      averageRating: 0, // Pas de reviews dans le schéma actuel
      totalReviews: 0,
      brand: product.brands, // Renommer brands en brand
      category: product.categories, // Renommer categories en category
    }))
    
    const hasMore = (page * limit) < total
    
    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau produit (Admin/Vendeur uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = productSchema.parse(body)
    
    const product = await prisma.products.create({
      data: {
        name: sanitizeInput(validatedData.name),
        description: sanitizeInput(validatedData.description),
        price: validatedData.price,
        category_id: validatedData.category_id,
        brand_id: validatedData.brand_id,
        sku: validatedData.sku,
        featured: validatedData.featured,
        isNew: validatedData.isNew,
        onSale: validatedData.onSale,
        originalPrice: validatedData.originalPrice,
        is_active: validatedData.is_active,
      },
      include: {
        variants: true,
        brands: true,
        categories: true,
        product_images: true,
      }
    })
    
    return NextResponse.json(product, { status: 201 })
    
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
