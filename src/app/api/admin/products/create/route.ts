import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

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
    
    // Validation des données requises
    if (!data.name || !data.price || !data.brand_id || !data.category_id) {
      return NextResponse.json(
        { error: 'Données requises manquantes (name, price, brand_id, category_id)' },
        { status: 400 }
      )
    }

    // Vérifier que la marque et la catégorie existent
    const brand = await prisma.brands.findUnique({
      where: { id: parseInt(data.brand_id) }
    })

    if (!brand) {
      return NextResponse.json({ error: 'Marque non trouvée' }, { status: 400 })
    }

    const category = await prisma.categories.findUnique({
      where: { id: parseInt(data.category_id) }
    })

    if (!category) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 400 })
    }

    // Créer le produit
    const product = await prisma.products.create({
      data: {
        name: data.name,
        description: data.description || '',
        price: parseFloat(data.price),
        sku: data.sku || '',
        featured: data.featured || false,
        isNew: data.isNew || false,
        onSale: data.onSale || false,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        is_active: data.is_active !== false,
        brand_id: parseInt(data.brand_id),
        category_id: parseInt(data.category_id),
        created_at: new Date()
      },
      include: {
        brands: true,
        categories: true
      }
    })

    // Créer les variantes si fournies
    if (data.variants && Array.isArray(data.variants)) {
      for (const variantData of data.variants) {
        await prisma.variants.create({
          data: {
            product_id: product.id,
            size: variantData.size || '',
            color: variantData.color || '',
            price: variantData.price ? parseFloat(variantData.price) : product.price,
            stock: parseInt(variantData.stock) || 0,
            created_at: new Date()
          }
        })
      }
    } else {
      // Créer une variante par défaut
      await prisma.variants.create({
        data: {
          product_id: product.id,
          size: 'Unique',
          color: 'Standard',
          price: product.price,
          stock: parseInt(data.stock) || 0,
          created_at: new Date()
        }
      })
    }

    // Ajouter les images si fournies
    if (data.images && Array.isArray(data.images)) {
      for (const [index, imageData] of data.images.entries()) {
        await prisma.product_images.create({
          data: {
            product_id: product.id,
            image_url: imageData.url,
            alt_text: imageData.alt || product.name,
            is_primary: index === 0
          }
        })
      }
    }

    return NextResponse.json({
      message: 'Produit créé avec succès',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        brand: product.brands.name,
        category: product.categories.name
      }
    })

  } catch (error: any) {
    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}
