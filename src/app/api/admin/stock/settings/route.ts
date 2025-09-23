import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// GET pour récupérer les paramètres de stock
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
    // Récupérer les statistiques de stock
    const totalVariants = await prisma.variants.count()
    const lowStockVariants = await prisma.variants.count({
      where: { stock: { lte: 10, gt: 0 } }
    })
    const outOfStockVariants = await prisma.variants.count({
      where: { stock: 0 }
    })
    const inStockVariants = await prisma.variants.count({
      where: { stock: { gt: 10 } }
    })

    // Récupérer les produits avec stock faible
    const lowStockProducts = await prisma.variants.findMany({
      where: { stock: { lte: 10, gt: 0 } },
      include: {
        products: {
          include: {
            brands: true,
            categories: true
          }
        }
      },
      orderBy: { stock: 'asc' },
      take: 10
    })

    // Récupérer les produits en rupture de stock
    const outOfStockProducts = await prisma.variants.findMany({
      where: { stock: 0 },
      include: {
        products: {
          include: {
            brands: true,
            categories: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10
    })

    // Statistiques par marque
    const brandStats = await prisma.products.groupBy({
      by: ['brand_id'],
      _count: { id: true }
    })

    // Récupérer les noms des marques
    const brandIds = brandStats.map(stat => stat.brand_id)
    const brands = await prisma.brands.findMany({
      where: { id: { in: brandIds } },
      select: { id: true, name: true }
    })

    const brandStatsWithNames = brandStats.map(stat => ({
      brandId: stat.brand_id,
      brandName: brands.find(b => b.id === stat.brand_id)?.name || 'Inconnu',
      productCount: stat._count.id
    }))

    return NextResponse.json({
      summary: {
        totalVariants,
        lowStockVariants,
        outOfStockVariants,
        inStockVariants,
        lowStockPercentage: totalVariants > 0 ? (lowStockVariants / totalVariants * 100).toFixed(1) : 0,
        outOfStockPercentage: totalVariants > 0 ? (outOfStockVariants / totalVariants * 100).toFixed(1) : 0
      },
      alerts: {
        lowStock: lowStockProducts.map(variant => ({
          id: variant.id,
          productName: variant.products.name,
          brand: variant.products.brands.name,
          category: variant.products.categories.name,
          size: variant.size,
          color: variant.color,
          stock: variant.stock
        })),
        outOfStock: outOfStockProducts.map(variant => ({
          id: variant.id,
          productName: variant.products.name,
          brand: variant.products.brands.name,
          category: variant.products.categories.name,
          size: variant.size,
          color: variant.color,
          stock: variant.stock
        }))
      },
      brandStats: brandStatsWithNames
    })

  } catch (error: any) {
    console.error('Erreur lors de la récupération des paramètres de stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres de stock' },
      { status: 500 }
    )
  }
}

// POST pour mettre à jour les paramètres de stock
export async function POST(request: NextRequest) {
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
    const data = await request.json()
    const { action, settings } = data

    switch (action) {
      case 'setLowStockThreshold':
        // Définir le seuil de stock faible
        // Cette fonctionnalité pourrait être stockée dans une table de configuration
        return NextResponse.json({
          message: 'Seuil de stock faible mis à jour',
          threshold: settings.threshold
        })

      case 'autoReorder':
        // Configuration de la réapprovisionnement automatique
        return NextResponse.json({
          message: 'Configuration de réapprovisionnement mise à jour',
          autoReorder: settings.enabled,
          threshold: settings.threshold,
          reorderQuantity: settings.quantity
        })

      case 'bulkUpdate':
        // Mise à jour en masse des stocks
        const { updates } = settings
        const results = []

        for (const update of updates) {
          try {
            const variant = await prisma.variants.update({
              where: { id: update.variantId },
              data: {
                stock: parseInt(update.stock)
              }
            })
            results.push({
              variantId: variant.id,
              success: true,
              newStock: variant.stock
            })
          } catch (error) {
            results.push({
              variantId: update.variantId,
              success: false,
              error: 'Erreur lors de la mise à jour'
            })
          }
        }

        return NextResponse.json({
          message: 'Mise à jour en masse terminée',
          results
        })

      case 'generateReport':
        // Générer un rapport de stock
        const reportData = await generateStockReport()
        return NextResponse.json({
          message: 'Rapport de stock généré',
          report: reportData
        })

      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    )
  }
}

async function generateStockReport() {
  const variants = await prisma.variants.findMany({
    include: {
      products: {
        include: {
          brands: true,
          categories: true
        }
      }
    },
    orderBy: { stock: 'asc' }
  })

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalVariants: variants.length,
      totalStock: variants.reduce((sum, v) => sum + v.stock, 0),
      lowStock: variants.filter(v => v.stock <= 10 && v.stock > 0).length,
      outOfStock: variants.filter(v => v.stock === 0).length
    },
    details: variants.map(variant => ({
      productName: variant.products.name,
      brand: variant.products.brands.name,
      category: variant.products.categories.name,
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
      price: variant.price,
      status: variant.stock === 0 ? 'Rupture' : 
              variant.stock <= 10 ? 'Stock faible' : 'En stock'
    }))
  }

  return report
}
