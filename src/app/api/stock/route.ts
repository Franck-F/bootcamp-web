import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// GET - Récupérer le stock des produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const category = searchParams.get('category')
    const lowStock = searchParams.get('lowStock') === 'true'

    let whereClause: any = {}
    
    if (productId) {
      whereClause.product_id = parseInt(productId)
    }

    // Récupérer les produits avec leurs variantes
    const products = await prisma.products.findMany({
      where: {
        ...whereClause,
        is_active: true,
        ...(category && {
          categories: {
            name: category
          }
        })
      },
      include: {
        variants: true,
        brands: true,
        categories: true,
        product_images: true
      },
      take: 100
    })

    // Transformer les données pour le frontend
    const stockData = products.map(product => {
      const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0)
      const lowStockVariants = product.variants.filter(variant => variant.stock <= 5)
      
      let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock'
      if (totalStock === 0) {
        status = 'out-of-stock'
      } else if (lowStockVariants.length > 0) {
        status = 'low-stock'
      }

      return {
        id: product.id,
        productName: product.name,
        brand: product.brands?.name || 'Marque inconnue',
        category: product.categories?.name || 'Catégorie inconnue',
        currentStock: totalStock,
        minStock: 5,
        maxStock: 100,
        price: product.price,
        lastUpdated: product.created_at.toISOString(),
        status,
        sales: Math.floor(Math.random() * 50), // Simulé
        revenue: Number(product.price) * Math.floor(Math.random() * 20), // Simulé
        image: product.product_images[0]?.image_url || '/images/placeholder-sneaker.jpg',
        variants: product.variants.map(variant => ({
          id: variant.id,
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          price: variant.price
        }))
      }
    })

    // Filtrer par stock faible si demandé
    const filteredData = lowStock 
      ? stockData.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock')
      : stockData

    return NextResponse.json(filteredData)
    
  } catch (error) {
    console.error('Erreur lors de la récupération du stock:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST - Mettre à jour le stock d'une variante
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
    const { variantId, stock } = body

    if (!variantId || stock === undefined) {
      return NextResponse.json(
        { error: 'ID variante et stock requis' },
        { status: 400 }
      )
    }

    // Mettre à jour le stock de la variante
    const updatedVariant = await prisma.variants.update({
      where: { id: parseInt(variantId) },
      data: { stock: parseInt(stock) },
      include: {
        products: {
          include: {
            brands: true,
            categories: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Stock mis à jour avec succès',
      variant: {
        id: updatedVariant.id,
        size: updatedVariant.size,
        color: updatedVariant.color,
        stock: updatedVariant.stock,
        price: updatedVariant.price,
        product: {
          id: updatedVariant.products.id,
          name: updatedVariant.products.name,
          brand: updatedVariant.products.brands?.name,
          category: updatedVariant.products.categories?.name
        }
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le stock en masse
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { updates } = body

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      )
    }

    // Mettre à jour plusieurs variantes en une fois
    const updatePromises = updates.map(({ variantId, stock }) =>
      prisma.variants.update({
        where: { id: parseInt(variantId) },
        data: { stock: parseInt(stock) }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: `${updates.length} variantes mises à jour avec succès`
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour en masse:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}