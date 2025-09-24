import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// export const runtime = 'edge'
export const dynamic = 'force-dynamic' // Temporairement désactivé pour Prisma // Cloudflare Pages compatible

// GET - Récupérer un produit par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID de produit invalide' },
        { status: 400 }
      )
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        brands: true,
        categories: true,
        variants: true,
        product_images: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Formater les données pour correspondre au format attendu
    const formattedProduct = {
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
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT et DELETE temporairement désactivés pour le déploiement Edge Runtime