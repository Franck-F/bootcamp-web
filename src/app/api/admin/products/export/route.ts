import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const featured = searchParams.get('featured')
    const isNew = searchParams.get('isNew')
    const onSale = searchParams.get('onSale')

    // Construire les filtres
    const where: any = {}
    
    if (category) where.category_id = parseInt(category)
    if (brand) where.brand_id = parseInt(brand)
    if (featured) where.featured = featured === 'true'
    if (isNew) where.isNew = isNew === 'true'
    if (onSale) where.onSale = onSale === 'true'

    // Récupérer les produits avec leurs relations
    const products = await prisma.products.findMany({
      where,
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

    // Formater les données pour l'export
    const exportData = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      sku: product.sku,
      featured: product.featured,
      isNew: product.isNew,
      onSale: product.onSale,
      originalPrice: product.originalPrice,
      is_active: product.is_active,
      brand: product.brands.name,
      category: product.categories.name,
      variants: product.variants.map(variant => ({
        size: variant.size,
        color: variant.color,
        price: variant.price,
        stock: variant.stock
      })),
      images: product.product_images.map(img => ({
        url: img.image_url,
        alt: img.alt_text,
        primary: img.is_primary
      })),
      created_at: product.created_at
    }))

    if (format === 'csv') {
      const csv = convertToCSV(exportData)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else {
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

  } catch (error: any) {
    console.error('Erreur lors de l\'export:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des produits' },
      { status: 500 }
    )
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = [
    'id', 'name', 'description', 'price', 'sku', 'featured', 'isNew', 'onSale',
    'originalPrice', 'is_active', 'brand', 'category', 'created_at', 'updated_at'
  ]

  const csvRows = [headers.join(',')]

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return ''
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csvRows.push(values.join(','))
  }

  return csvRows.join('\n')
}
