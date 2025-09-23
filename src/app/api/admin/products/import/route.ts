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
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      return NextResponse.json({ error: 'Format de fichier non supporté' }, { status: 400 })
    }

    const content = await file.text()
    let products: any[] = []

    // Parser le fichier selon son format
    if (file.name.endsWith('.csv')) {
      products = parseCSV(content)
    } else if (file.name.endsWith('.json')) {
      products = JSON.parse(content)
    }

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Format de données invalide' }, { status: 400 })
    }

    const results = {
      imported: 0,
      updated: 0,
      errors: [] as string[]
    }

    // Traiter chaque produit
    for (let index = 0; index < products.length; index++) {
      const productData = products[index]
      try {
        await processProduct(productData, results)
      } catch (error: any) {
        results.errors.push(`Ligne ${index + 1}: ${error.message}`)
      }
    }

    return NextResponse.json({
      message: 'Import terminé',
      results: {
        total: products.length,
        imported: results.imported,
        updated: results.updated,
        errors: results.errors.length,
        errorDetails: results.errors
      }
    })

  } catch (error: any) {
    console.error('Erreur lors de l\'import:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'import des produits' },
      { status: 500 }
    )
  }
}

function parseCSV(content: string): any[] {
  const lines = content.split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const products = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim())
      const product: any = {}
      
      headers.forEach((header, index) => {
        product[header] = values[index] || ''
      })
      
      products.push(product)
    }
  }

  return products
}

async function processProduct(productData: any, results: any) {
  // Validation des données requises
  if (!productData.name || !productData.price || !productData.brand || !productData.category) {
    throw new Error('Données requises manquantes (name, price, brand, category)')
  }

  // Trouver ou créer la marque
  let brand = await prisma.brands.findFirst({
    where: { name: productData.brand }
  })

  if (!brand) {
    brand = await prisma.brands.create({
      data: { name: productData.brand }
    })
  }

  // Trouver ou créer la catégorie
  let category = await prisma.categories.findFirst({
    where: { name: productData.category }
  })

  if (!category) {
    category = await prisma.categories.create({
      data: { name: productData.category }
    })
  }

  // Vérifier si le produit existe déjà
  const existingProduct = await prisma.products.findFirst({
    where: {
      name: productData.name,
      brands: { id: brand.id }
    }
  })

  const productDataToSave = {
    name: productData.name,
    description: productData.description || '',
    price: parseFloat(productData.price),
    sku: productData.sku || '',
    featured: productData.featured === 'true' || productData.featured === true,
    isNew: productData.isNew === 'true' || productData.isNew === true,
    onSale: productData.onSale === 'true' || productData.onSale === true,
    originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
    is_active: productData.is_active !== 'false',
    brand_id: brand.id,
    category_id: category.id,
    updated_at: new Date()
  }

  if (existingProduct) {
    // Mettre à jour le produit existant
    await prisma.products.update({
      where: { id: existingProduct.id },
      data: productDataToSave
    })
    results.updated++
  } else {
    // Créer un nouveau produit
    await prisma.products.create({
      data: {
        ...productDataToSave,
        created_at: new Date()
      }
    })
    results.imported++
  }
}
