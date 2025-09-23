import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Vérifier que l'utilisateur est admin
  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const data = await request.json()
    const { productId, variantId, newStock, operation } = data

    if (!productId && !variantId) {
      return NextResponse.json(
        { error: 'ID produit ou variante requis' },
        { status: 400 }
      )
    }

    if (operation === 'bulk') {
      // Mise à jour en masse
      const { updates } = data
      if (!Array.isArray(updates)) {
        return NextResponse.json(
          { error: 'Format de mise à jour en masse invalide' },
          { status: 400 }
        )
      }

      const results = []
      for (const update of updates) {
        try {
          const variant = await prisma.variants.update({
            where: { id: update.variantId },
            data: { 
              stock: parseInt(update.stock)
            },
            include: {
              products: {
                include: {
                  brands: true
                }
              }
            }
          })
          results.push({
            variantId: variant.id,
            productName: variant.products.name,
            brand: variant.products.brands.name,
            size: variant.size,
            color: variant.color,
            newStock: variant.stock,
            success: true
          })
        } catch (error) {
          results.push({
            variantId: update.variantId,
            error: 'Erreur lors de la mise à jour',
            success: false
          })
        }
      }

      return NextResponse.json({
        message: 'Mise à jour en masse terminée',
        results
      })
    }

    // Mise à jour d'une variante spécifique
    if (variantId) {
      const variant = await prisma.variants.findUnique({
        where: { id: variantId },
        include: {
          products: {
            include: {
              brands: true
            }
          }
        }
      })

      if (!variant) {
        return NextResponse.json({ error: 'Variante non trouvée' }, { status: 404 })
      }

      const updatedVariant = await prisma.variants.update({
        where: { id: variantId },
        data: { 
          stock: parseInt(newStock)
        },
        include: {
          products: {
            include: {
              brands: true
            }
          }
        }
      })

      return NextResponse.json({
        message: 'Stock mis à jour avec succès',
        variant: {
          id: updatedVariant.id,
          productName: updatedVariant.products.name,
          brand: updatedVariant.products.brands.name,
          size: updatedVariant.size,
          color: updatedVariant.color,
          stock: updatedVariant.stock
        }
      })
    }

    // Mise à jour de toutes les variantes d'un produit
    if (productId) {
      const product = await prisma.products.findUnique({
        where: { id: productId },
        include: {
          variants: true,
          brands: true
        }
      })

      if (!product) {
        return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
      }

      const updatedVariants = []
      for (const variant of product.variants) {
        const updatedVariant = await prisma.variants.update({
          where: { id: variant.id },
          data: { 
            stock: parseInt(newStock)
          }
        })
        updatedVariants.push(updatedVariant)
      }

      return NextResponse.json({
        message: 'Stock de toutes les variantes mis à jour',
        product: {
          id: product.id,
          name: product.name,
          brand: product.brands.name,
          variantsUpdated: updatedVariants.length,
          newStock: parseInt(newStock)
        }
      })
    }

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du stock' },
      { status: 500 }
    )
  }
}

// GET pour récupérer les informations de stock
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const lowStock = searchParams.get('lowStock')
    const outOfStock = searchParams.get('outOfStock')
    const productId = searchParams.get('productId')

    let where: any = {}
    
    if (productId) {
      where.product_id = parseInt(productId)
    }

    if (lowStock === 'true') {
      where.stock = { lte: 10 }
    }

    if (outOfStock === 'true') {
      where.stock = 0
    }

    const variants = await prisma.variants.findMany({
      where,
      include: {
        products: {
          include: {
            brands: true,
            categories: true
          }
        }
      },
      orderBy: {
        stock: 'asc'
      }
    })

    const stockSummary = {
      total: variants.length,
      lowStock: variants.filter(v => v.stock <= 10 && v.stock > 0).length,
      outOfStock: variants.filter(v => v.stock === 0).length,
      inStock: variants.filter(v => v.stock > 10).length
    }

    return NextResponse.json({
      variants: variants.map(variant => ({
        id: variant.id,
        productName: variant.products.name,
        brand: variant.products.brands.name,
        category: variant.products.categories.name,
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        price: variant.price,
        status: variant.stock === 0 ? 'out-of-stock' : 
                variant.stock <= 10 ? 'low-stock' : 'in-stock'
      })),
      summary: stockSummary
    })

  } catch (error: any) {
    console.error('Erreur lors de la récupération du stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du stock' },
      { status: 500 }
    )
  }
}
